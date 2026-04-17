-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name            VARCHAR(100), -- should not it be first name and last name
    preferred_language VARCHAR(50),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();



CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    persona_type VARCHAR(50) NOT NULL, -- 'girlfriend','boyfriend','dadi','yaar','bollywood'
    language_code VARCHAR(10) DEFAULT 'hi' NOT NULL, -- 'hi', 'bn', 'ta', 'en'
    description TEXT,
    system_prompt TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1, --but is there backward compability (can note manual v1)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES characters(id),
    memory JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_message_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_character_id ON conversations(character_id);
CREATE UNIQUE INDEX idx_conversations_user_character_unique ON conversations(user_id, character_id);

CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role            VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    type            VARCHAR(10) DEFAULT 'text' CHECK (type IN ('text', 'voice')),
    content         TEXT NOT NULL,
    audio_url       TEXT, -- null = text, populated = voice message
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conv_time
ON messages(conversation_id, created_at DESC, id DESC);

-- ============================================================
-- MEMORY (per user per character)
-- ============================================================
CREATE TABLE user_character_memory (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES characters(id),
    memory        JSONB NOT NULL DEFAULT '{}',
    updated_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, character_id)               -- composite key, one row per pair
);




CREATE TABLE credits (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    balance    INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)                             -- one row per user
);

CREATE TABLE credit_transactions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount       INT NOT NULL,                  -- positive = recharge, negative = spend
    type         VARCHAR(20) NOT NULL,          -- 'recharge','text_message','voice_message','bonus'
    reference_id UUID,                          -- message_id or payment_id depending on type
    metadata     JSONB,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);


-- update last_message_at on conversations when a new message is inserted
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id
    AND last_message_at < NEW.created_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();



-- spend credits atomically (use inside a transaction with message insert)
-- CREATE OR REPLACE FUNCTION spend_credits(
--     p_user_id      UUID,
--     p_amount       INT,
--     p_type         VARCHAR,
--     p_reference_id UUID
-- ) RETURNS BOOLEAN AS $$
-- DECLARE
--     current_balance INT;
-- BEGIN
--     SELECT balance INTO current_balance
--     FROM public.credits
--     WHERE user_id = p_user_id
--     FOR UPDATE;                                 -- lock row, prevent race conditions

--     IF current_balance IS NULL OR current_balance < p_amount THEN
--         RETURN FALSE;                           -- insufficient credits, caller handles this
--     END IF;

--     UPDATE credits
--     SET balance = balance - p_amount
--     WHERE user_id = p_user_id;

--     INSERT INTO public.credit_transactions (user_id, amount, type, reference_id)
--     VALUES (p_user_id, -p_amount, p_type, p_reference_id);

--     RETURN TRUE;
-- END;
-- $$ LANGUAGE plpgsql;
-- recharge credits atomically and record the transaction
CREATE OR REPLACE FUNCTION recharge_credits(
    p_user_id      UUID,
    p_amount       INT,
    p_type         VARCHAR,
    p_metadata     JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    current_balance INT;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Recharge amount must be greater than zero';
    END IF;

    SELECT c.balance INTO current_balance
    FROM public.credits
    AS c
    WHERE c.user_id = p_user_id
    FOR UPDATE;

    IF current_balance IS NULL THEN
        RETURN FALSE;
    END IF;

    UPDATE public.credits
    SET balance = balance + p_amount
    WHERE user_id = p_user_id;

    INSERT INTO public.credit_transactions (user_id, amount, type, reference_id, metadata)
    VALUES (p_user_id, p_amount, p_type, NULL, p_metadata);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


-- atomically spend credits and persist both messages
CREATE OR REPLACE FUNCTION process_message_with_credits(
    p_user_id            UUID,
    p_conversation_id    UUID,
    p_user_content       TEXT,
    p_assistant_content  TEXT,
    p_message_type       VARCHAR DEFAULT 'text',
    p_credit_type        VARCHAR DEFAULT 'text_message',
    p_credit_amount      INT DEFAULT 1
) RETURNS TABLE (
    success                       BOOLEAN,
    error_code                    TEXT,
    user_message_id               UUID,
    user_message_created_at       TIMESTAMPTZ,
    assistant_message_id          UUID,
    assistant_message_created_at  TIMESTAMPTZ,
    balance                       INT
) AS $$
DECLARE
    current_balance INT;
    updated_balance INT;
    v_user_message_id UUID;
    v_user_message_created_at TIMESTAMPTZ;
    v_assistant_message_id UUID;
    v_assistant_message_created_at TIMESTAMPTZ;
BEGIN
    IF p_credit_amount <= 0 THEN
        RAISE EXCEPTION 'Credit amount must be greater than zero';
    END IF;

    IF p_message_type <> 'text' THEN
        RAISE EXCEPTION 'process_message_with_credits only supports text messages';
    END IF;

    SELECT c.balance INTO current_balance
    FROM public.credits AS c
    WHERE c.user_id = p_user_id
    FOR UPDATE;

    IF current_balance IS NULL THEN
        RETURN QUERY
        SELECT FALSE, 'credits_not_found', NULL::UUID, NULL::TIMESTAMPTZ, NULL::UUID, NULL::TIMESTAMPTZ, NULL::INT;
        RETURN;
    END IF;

    IF current_balance < p_credit_amount THEN
        RETURN QUERY
        SELECT FALSE, 'insufficient_credits', NULL::UUID, NULL::TIMESTAMPTZ, NULL::UUID, NULL::TIMESTAMPTZ, current_balance;
        RETURN;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.conversations
        WHERE id = p_conversation_id
          AND user_id = p_user_id
    ) THEN
        RETURN QUERY
        SELECT FALSE, 'conversation_not_found', NULL::UUID, NULL::TIMESTAMPTZ, NULL::UUID, NULL::TIMESTAMPTZ, current_balance;
        RETURN;
    END IF;

    UPDATE public.credits AS c
    SET balance = c.balance - p_credit_amount
    WHERE c.user_id = p_user_id
    RETURNING c.balance INTO updated_balance;

    INSERT INTO public.messages (conversation_id, role, type, content)
    VALUES (p_conversation_id, 'user', p_message_type, p_user_content)
    RETURNING id, created_at INTO v_user_message_id, v_user_message_created_at;

    INSERT INTO public.messages (conversation_id, role, type, content, created_at)
    VALUES (p_conversation_id, 'assistant', p_message_type, p_assistant_content, v_user_message_created_at + interval '1 millisecond')
    RETURNING id, created_at INTO v_assistant_message_id, v_assistant_message_created_at;

    INSERT INTO public.credit_transactions (user_id, amount, type, reference_id)
    VALUES (p_user_id, -p_credit_amount, p_credit_type, v_user_message_id);

    RETURN QUERY
    SELECT
        TRUE,
        NULL::TEXT,
        v_user_message_id,
        v_user_message_created_at,
        v_assistant_message_id,
        v_assistant_message_created_at,
        updated_balance;
END;
$$ LANGUAGE plpgsql;



-- auto-create credits row (20 free credits) when profile is created

CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 20);  -- 20 free credits on signup
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile();
