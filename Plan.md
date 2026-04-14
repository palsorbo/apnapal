# ApnaPal — MVP Build Plan

## Current State
- basic API working
- direct Anthropic call
- persona in DB
- no memory
- no auth
- no credits

---

## Phase 1 — Foundation

### 1.1 Database
- [ ] run full SQL schema in Supabase
- [ ] verify all tables, indexes, triggers exist
- [ ] seed 2–3 characters (Priya GF, Arjun BF, Dadi)
- [ ] write system prompts for each character in DB
- [ ] test handle_new_user trigger creates profile + credits row

### 1.2 Auth
- [ ] enable Email OTP in Supabase dashboard
- [ ] test OTP send + verify flow end to end
- [ ] protect all API routes with Supabase JWT verification
- [ ] confirm user_id flows correctly into all DB writes

---

## Phase 2 — Core Chat Pipeline

### 2.1 Persona layer
- [x] fetch character from DB by character_id
- [x] build BASE_TEMPLATE constant
- [x] assemble: BASE + character.system_prompt
- [ ] test: does Priya sound like Priya

### 2.2 Short-term memory
- [x] fetch last 10 messages from conversations
- [x] fetch conversations.memory (mood/topic)
- [x] inject both into system prompt
- [x] instruct LLM to return { reply, state } JSON
- [x] parse state → UPDATE conversations.memory after each turn

### 2.3 Long-term memory
- [x] fetch user_character_profiles.memory → inject facts into prompt
- [x] after every 10th message → fire async extraction job
- [x] extraction prompt: return JSON array of facts, max 15
- [x] merge new facts with existing → UPDATE user_character_profiles.memory
- [x] guard: only write if new facts array is non-empty

### 2.4 Credits
- [ ] call process_message_with_credits() BEFORE any LLM call
- [ ] text message = 1 credit
- [ ] return 402 if insufficient — no LLM call made
- [ ] verify credit_transactions row written on every deduction

---

## Phase 3 — API Routes (Cloudflare Workers)

### 3.1 Auth
- [X] POST /auth/send-otp
- [X] POST /auth/verify-otp

### 3.2 Characters
- [x] GET /characters
- [x] GET /characters/:id

### 3.3 Conversations
- [x] POST /conversations
- [x] GET /conversations
- [x] GET /conversations/:id/messages (paginated)

### 3.4 Messages
- [x] POST /conversations/:id/message

### 3.5 Credits
- [x] GET /credits
- [x] GET /credits/transactions
- [x] POST /credits/recharge
- [x] POST /credits/recharge/verify
- [x] POST /webhooks/razorpay

### 3.6 Profile
- [x] GET /profile
- [x] PATCH /profile

---

## Phase 4 — Frontend (Next.js 16, mobile first)

### 4.1 Onboarding
- [ ] splash screen
- [ ] email id entry
- [ ] OTP verify (auto-submit on 6th digit)

### 4.2 Home
- [ ] character cards grid (2 column)
- [ ] filter by language
- [ ] tap → character profile

### 4.3 Character profile
- [ ] avatar, name, description
- [ ] sticky CTA at bottom

### 4.4 Chat screen
- [ ] message bubbles
- [ ] character avatar + name in header
- [ ] credit balance in header
- [ ] typing indicator
- [ ] text input + send
- [ ] handle 402 → recharge bottom sheet

### 4.5 Credits
- [ ] balance screen
- [ ] transaction history
- [ ] recharge bottom sheet (₹49 / ₹99 / ₹199)
- [ ] Razorpay integration

### 4.6 Profile
- [ ] name edit
- [ ] preferred language selector

---

## Phase 5 — Polish

- [ ] dvh instead of vh in CSS
- [ ] safe-area-inset-bottom on input bar
- [ ] Devanagari font-size 17px, line-height 1.6
- [ ] loading skeletons
- [ ] error states
- [ ] empty states
- [ ] PWA install prompt
- [ ] test Android Chrome + iOS Safari

---

## Phase 6 — Voice (after text is stable)

### 6.1 Voice server (Render / Fly.io)
- [ ] scaffold Node/Fastify server
- [ ] Supabase JWT auth middleware
- [ ] POST /voice route, multipart blob

### 6.2 Pipeline
- [ ] STT: Sarvam saarika
- [ ] pass transcript to same chat pipeline
- [ ] TTS: Sarvam bulbul, use character.voice_id
- [ ] upload to Cloudflare R2
- [ ] return { text, audio_url }

### 6.3 Voice credits + frontend
- [ ] spend_credits() before pipeline, 50 credits
- [ ] hold-to-record button in chat (WhatsApp pattern)
- [ ] audio playback on voice messages

---

## Rules
- credits deducted BEFORE LLM call, always
- never block chat response for long-term memory extraction
- finish Phase 1 fully before Phase 2
- one character working end-to-end before adding more
- test on mobile Chrome + Safari after every phase

## Not in MVP
- character creation (v2)
- multiple languages beyond Hinglish (v2)
- notifications (v2)
- social features (v2)