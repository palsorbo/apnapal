# ApnaPal Orchestrated AI Pipeline

ApnaPal is an AI companion mobile-first webapp designed specifically for the Indian market, focusing on cultural context, regional languages, and high accessibility.

To support dynamic and engaging AI companions, ApnaPal employs a highly reliable, sequential **Orchestrated AI Pipeline** running efficiently on edge infrastructure (Cloudflare Workers) and backed by Supabase.

> [!NOTE]
> **Architectural Philosophy (v1):** While we occasionally use the term "Agent" as a historical shorthand for specialized logical modules (e.g., the "Memory Agent"), it is critical to note that **these are not autonomous decision-makers**. They do not loop or decide their own next actions. What we have built for v1 is a deterministic pipeline. This orchestrated approach is intentionally chosen over a true multi-agent system because it is simpler, faster, and far more reliable for a consumer product at this stage.

This document outlines the specialized pipeline steps that drive the ApnaPal experience, as well as the overarching system structure that supports them.

---

## System Architecture Overview

ApnaPal is built as a modern, edge-native monorepo (using NPM workspaces) to seamlessly bridge the user interface, central persistence, and AI capabilities.

- **The Frontend (`apps/fe`):** A highly-accessible, mobile-first Next.js 16+ (React 19) web application. Designed for speed, it connects with Supabase Auth for client-side sessions and securely proxies complex logic to the Edge Engine.
- **The Edge Engine (`apps/worker`):** A Cloudflare Worker acting as the backend API and main AI orchestrator. It executes Anthropic Claude (`claude-3-haiku`) calls, orchestrates background memory extractions, and securely enforces the application's credit-billing system.
- **The Voice Engine (Render/Fly):** A dedicated service handling the Voice & Multimodal Agent. Isolated from the Cloudflare Worker to reliably process multipart audio uploads and orchestrate speech-to-text (STT).
- **The Database (`supabase/`):** A Supabase PostgreSQL instance serving as the single source of truth for user profiles, character parameters, conversational transcripts, and the extracted semantic `user_character_memory`.
- **Shared Libraries (`packages/`):** The monorepo uses `@apnapal/types` and `@apnapal/utils` to enforce strict TypeScript safety and share utility functions across the network boundary between the Next.js frontend and the background services.

---

## Core Pipeline Modules ("Agents")

### 1. The Persona (Companion) Module
The primary user-facing step responsible for holding empathetic, engaging, and in-character conversations.

- **Role:** Generates localized and context-aware responses based on a specific character's traits (e.g., "storyteller", "friend", "mentor").
- **Capabilities:**
  - **Contextual Understanding:** Incorporates character histories and real-time conversation context.
  - **Localization:** Supports multi-lingual and code-switched dialogues (e.g., Hinglish, regional vernacular) using the `lang` filtering logic and base LLM capabilities.
- **Underlying Technology:** Anthropic Claude API (`claude-3-haiku`) managed via Cloudflare Workers edge functions. Cost-efficient and fast for mobile text generation.

### 2. The Short-Term Context Module
A synchronous pipeline step managing the immediate conversational flow, updating the state every single turn.

- **Role:** Analyzes the active conversation to update the current `conversations.memory` object (tracking immediate mood, active topics, or short-term intent).
- **Trigger Condition:** Operates every single turn.
- **Benefit:** Keeps the Persona logically grounded in the current conversation's immediate emotional and topical context without needing to recount the whole transcript.

### 3. The Long-Term Memory Module
A background pipeline step that handles long-term context, ensuring the companion "remembers" the user over time without bloating the context window.

- **Role:** Periodically extracts factual information and significant personal details from user conversations, storing them as persistent memory fragments.
- **Trigger Condition:** Operates systematically (triggered every 10 messages per the current implementation logic).
- **Execution:** Reads the latest segment of the active conversation, distills facts (e.g., "User's favorite sport is cricket", "User has a dog named Chotu"), and updates the `user_character_memory` table in Supabase.
- **Benefit:** Allows the Persona Module to seamlessly recall past interactions and personalize the companion experience uniquely for each user.

### 4. The Voice & Multimodal Component
An interface processing step responsible for bridging voice inputs and audio outputs, critical for a mobile-first experience in India where voice interaction is highly prevalent.

- **Hosting:** Deployed on Render/Fly (independent of Cloudflare Workers) to natively and reliably handle multipart audio uploads.
- **Role:** Transcribes user voice notes and (optionally) orchestrates text-to-speech for the character's voice.
- **Capabilities:**
  - **Speech-to-Text (STT):** Receives audio blob via multipart POST, transcribes via STT, and passes the text payload to the Persona Module.
  - **Credit Management Intricacies:** Manages the increased resource utilization securely (mapping to the 2-credit cost for voice interactions).

## Future / Planned Enhancements

### 5. Localization & Transliteration Step
While the base LLM handles multiple languages, an upcoming dedicated localization processor could be introduced to perfectly translate idiomatic expressions and cultural nuances before or after the Persona generation turn.

### 6. Safety & Trust Guardrail Step
A specialized, lightweight classification model to preemptively filter sensitive topics, ensure cultural sensitivity, and adhere to local regulatory boundaries before a message is rendered to the user.

---

## Pipeline Orchestration & Request Flow

1. **User Input:** User sends a text or voice message from the mobile webapp.
2. **Routing & Pre-processing:** Text requests securely hit the Cloudflare Worker API (`POST /conversations/:id/message`). Voice requests containing multipart audio are routed to the Render/Fly Voice Engine for reliable extraction and transcription.
3. **Credit Verification & Deduction:** The worker synchronously calls `spend_credits()` (deducting 1 for text, 2 for voice) **before** making any LLM calls. If this fails due to insufficient balance, the pipeline immediately halts and returns a `402 Payment Required` error to prompt the paywall flow. We never generate an LLM response and then fail to charge.
4. **Context Injection:** The worker pulls relevant long-term context (`user_character_memory`) and reads the current short-term context (`conversations.memory`), injecting both into the system prompt.
5. **Generation (Persona Module):** The Claude API streams the response back based on the combined context.
6. **Post-processing (Memory Updates):** After generation, the worker synchronously updates `conversations.memory` with the mood/topic from this turn. If the message threshold (e.g., 10 messages) is met, an asynchronous event kicks off the Long-Term Memory extraction processor to distill facts and update the database for future turns.
