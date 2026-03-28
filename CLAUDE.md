# Handshake — Decentralized AI Model Registry

> "The Web3 equivalent of Hugging Face. Every model uploaded is cryptographically owned, provenance-tracked, and censorship-resistant."

**Bachelor's Thesis** — Burak ER & Deniz BAKICI @ IBU
**Supervisor**: Tugba Dalyan
**Title**: *Handshake: A Decentralized AI Model Registry with Blockchain-Based Provenance*

---

## 1. Project Vision

Handshake answers one question for every AI model:
**"Who created this, when, from what, and can it be trusted?"**

This answer is written to a blockchain — immutable, verifiable, owned by the creator's wallet.

### What It Is
- A **model identity layer**: every uploaded model gets a blake3 hash, IPFS CID, and on-chain record
- A **provenance graph**: models declare their parent models (fine-tune, adapter, merge, etc.)
- A **compliance tool**: EU AI Act fields built into the upload wizard
- A **decentralized inference platform** (Phase 4): users can do inference about a uploaded model in a decentralized system

### What It Is NOT
- Not a model training platform (no compute)
- Not a dataset marketplace (models only)
- Not a centralized service (no company controls the models)

### Target Users
| User | Need |
|------|------|
| AI Researchers | Share models without institutional gatekeeping |
| Indie Developers | Monetize niche/specialized models |
| Enterprise Teams | Sovereign control over proprietary models |
| Auditors / Regulators | Verify AI model provenance and compliance |

### Competitive Position
| Platform | Gap Handshake Fills |
|----------|---------------------|
| Hugging Face | No blockchain verification, centralized, censorable |
| Ocean Protocol | Data-focused, not model registry |
| Story Protocol | IP licensing layer, not a hosting platform |
| Bittensor | Decentralized training, not static model storage |
| Og Network | Decentralized AI Operating System (DeAIOS), storage, decentralized AI inference and infrastructure, monetization.
| Akash Network | DePIN for cloud GPUs and computing platform 

---

## 2. Tech Stack (v2 — Fresh Start)

### Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Backend framework | **NestJS** | Built-in DI, modules, guards — clean arch by default. Express required manual wiring of everything. |
| Frontend framework | **Next.js 15 (App Router)** | Stable, familiar, Turbopack now production-ready |
| Monorepo tooling | **Turborepo + pnpm workspaces** | Fast, cache-aware, handles inter-package dependencies |
| TypeScript runner | **tsx** (not ts-node) | Handles ESM/CJS transparently, no `.js` extension hacks |
| Shared packages | **Source-only, no build step** | `transpilePackages` in Next.js + NestJS TS compilation handle it |
| Validation | **Zod (shared) + class-validator (NestJS DTOs)** | Zod for runtime parsing, class-validator for NestJS pipes |
| Database client | **Mongoose** | Familiar, schema-first, works well for this domain |
| API data fetching | **TanStack Query v5** | No manual useEffect+fetch, automatic caching |
| File hashing | **blake3** via `@noble/hashes` | Faster than SHA-256, Web Worker for non-blocking UI |
| Auth | **SIWE (EIP-4361) + HTTP-only cookies** | Wallet-native auth, no passwords |
| Wallet integration | **Wagmi v2 + viem** | Best-in-class React wallet hooks |

### Full Stack

```
handshake-v2/
├── apps/
│   ├── api/                          NestJS (port 4000)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.controller.ts    ← POST /auth/nonce, /verify, /me, /logout
│   │   │   │   │   ├── auth.service.ts       ← SIWE verify, session create/delete
│   │   │   │   │   ├── auth.guard.ts         ← reads session cookie, sets req.user
│   │   │   │   │   └── auth.dto.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── models.module.ts
│   │   │   │   │   ├── models.controller.ts  ← GET/POST /models, GET /models/:id
│   │   │   │   │   ├── models.service.ts     ← checkDuplicate, createModel, provenanceScore
│   │   │   │   │   ├── models.repository.ts  ← Mongoose queries only
│   │   │   │   │   └── models.dto.ts
│   │   │   │   ├── pinata/
│   │   │   │   │   ├── pinata.module.ts
│   │   │   │   │   ├── pinata.service.ts     ← uploadFile, uploadMetadata, signedUrl
│   │   │   │   │   └── pinata.controller.ts  ← GET /pinata/signed-url
│   │   │   │   └── blockchain/               ← Phase 3
│   │   │   │       ├── blockchain.module.ts
│   │   │   │       ├── blockchain.service.ts ← contract interactions
│   │   │   │       └── event-listener.service.ts ← ModelRegistered events → MongoDB
│   │   │   ├── common/
│   │   │   │   ├── exceptions/
│   │   │   │   │   └── domain.exception.ts   ← DomainException(code, statusCode)
│   │   │   │   ├── filters/
│   │   │   │   │   └── exception.filter.ts   ← global error formatter
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── logging.interceptor.ts
│   │   │   │   └── pipes/
│   │   │   │       └── zod-validation.pipe.ts
│   │   │   ├── database/
│   │   │   │   └── schemas/
│   │   │   │       ├── model.schema.ts       ← Mongoose Model schema
│   │   │   │       ├── session.schema.ts
│   │   │   │       └── nonce.schema.ts
│   │   │   ├── app.module.ts                 ← root module, imports all feature modules
│   │   │   └── main.ts                       ← bootstrap, cors, cookie-parser, pipes
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          Next.js 15 (port 3000)
│       ├── src/
│       │   ├── app/                  ← App Router pages
│       │   │   ├── layout.tsx        ← Providers wrapper
│       │   │   ├── page.tsx          ← Model registry (server component)
│       │   │   └── models/
│       │   │       └── [id]/
│       │   │           └── page.tsx  ← Model detail page
│       │   ├── components/
│       │   │   ├── ui/               ← shadcn/ui primitives (Button, Card, etc.)
│       │   │   ├── WalletButton.tsx  ← connect + SIWE sign-in, 3-state UI
│       │   │   ├── Providers.tsx     ← WagmiProvider + TanStackQuery + AuthContext
│       │   │   └── upload/
│       │   │       ├── UploadModal.tsx      ← modal shell
│       │   │       ├── UploadWizard.tsx     ← step router + useReducer state
│       │   │       ├── wizardReducer.ts     ← WizardState, WizardAction
│       │   │       ├── wizardTypes.ts       ← type definitions for wizard state
│       │   │       ├── Step1File.tsx        ← file drop + blake3 hash + duplicate check
│       │   │       ├── Step2Identity.tsx    ← name, desc, task, framework, license
│       │   │       ├── Step3Lineage.tsx     ← from_scratch | parents (IParentRef[])
│       │   │       ├── Step4Optional.tsx    ← tags, benchmarks, intendedUse
│       │   │       ├── Step5Summary.tsx     ← review + provenance score + confirm
│       │   │       └── useWizardUpload.ts   ← upload orchestration hook
│       │   ├── contexts/
│       │   │   └── AuthContext.tsx          ← isAuthenticated, walletAddress, checkAuth
│       │   ├── hooks/
│       │   │   └── useModels.ts             ← TanStack Query hooks for models API
│       │   ├── services/
│       │   │   ├── ApiService.ts            ← typed fetch wrapper for all endpoints
│       │   │   └── PinataService.ts         ← direct-to-Pinata file upload
│       │   ├── lib/
│       │   │   └── wagmi.ts                 ← Wagmi config (chains, connectors)
│       │   └── utils/
│       │       └── hashHelper.ts            ← blake3 Web Worker wrapper
│       ├── next.config.ts                   ← transpilePackages: ['@handshake/types']
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── types/                        Shared TypeScript — source only, no build step
│   │   ├── src/
│   │   │   ├── enums.ts              ← Task, Framework, License, Relationship, etc.
│   │   │   ├── model.ts              ← IModel, IParentRef, ITrainingData, IEvaluation
│   │   │   ├── dto.ts                ← CreateModelDTO, UpdateBlockchainDTO, etc.
│   │   │   └── index.ts              ← re-exports (no .js extensions)
│   │   └── package.json              ← NO "type": "module"
│   │
│   └── config/                       Shared env validation
│       ├── src/
│       │   ├── api.env.ts            ← Zod schema for API env vars
│       │   └── web.env.ts            ← Zod schema for Web env vars
│       └── package.json
│
├── contracts/                        Phase 3 — Hardhat
│   ├── contracts/
│   │   ├── ModelRegistry.sol         ← registerModel, getModel, ModelRegistered event
│   │   └── AccessControl.sol         ← Phase 5, paid downloads
│   ├── test/
│   ├── scripts/
│   │   └── deploy.ts
│   └── hardhat.config.ts
│
├── thesis/                           LaTeX thesis documents
├── research/                         Market research, architecture notes
│
├── docker-compose.yml                ← mongo + redis + api + web
├── turbo.json
├── pnpm-workspace.yaml
├── package.json                      ← root (turbo, typescript as devDeps)
├── CLAUDE.md                         ← THIS FILE
└── .env.example                      ← template for all env vars
```

---

## 3. Architecture

### Backend — NestJS Module Structure

```
apps/api/src/
├── modules/
│   ├── auth/           AuthModule
│   │   ├── auth.controller.ts    ← thin, only HTTP parsing
│   │   ├── auth.service.ts       ← SIWE verification, session lifecycle
│   │   ├── auth.guard.ts         ← replaces authMiddleware
│   │   └── auth.dto.ts           ← class-validator DTOs
│   ├── models/         ModelModule
│   │   ├── models.controller.ts
│   │   ├── models.service.ts     ← business logic
│   │   ├── models.repository.ts  ← Mongoose queries ONLY
│   │   └── models.dto.ts
│   ├── pinata/         PinataModule
│   │   ├── pinata.service.ts
│   │   └── pinata.controller.ts
│   └── blockchain/     BlockchainModule (Phase 2)
│       ├── blockchain.service.ts
│       └── event-listener.service.ts
├── common/
│   ├── exceptions/     DomainException (code + statusCode)
│   ├── filters/        GlobalExceptionFilter
│   ├── interceptors/   LoggingInterceptor, TransformInterceptor
│   └── pipes/          ZodValidationPipe
├── database/
│   └── schemas/        Mongoose schemas (Model, Session, Nonce)
└── main.ts
```

### 3-Tier Rule (STRICT)
```
Controller  → parse req, validate DTO, call service, return response
Service     → business logic, orchestration, throws DomainException
Repository  → Mongoose queries only, no business logic
```

**Controllers never import Mongoose. Services never import Mongoose. Only repositories do.**

### Shared Types Package (`packages/types`)

```
packages/types/src/
├── enums.ts        Task, Framework, License, Relationship, ParentSource, Quantization
├── model.ts        IModel, IParentRef, ITrainingData, IEvaluation, IBlockchainRecord
├── dto.ts          CreateModelDTO, UpdateBlockchainDTO, ModelListResponse
└── index.ts        re-exports everything
```

**Rules:**
- Import paths use no extensions: `export * from './enums'` (not `./enums.js`)
- `package.json` has NO `"type": "module"` — source-only package, consumed by bundlers
- `transpilePackages: ['@handshake/types']` in `next.config.ts`
- NestJS tsconfig includes `packages/types/src` in compilation

> **Lesson learned**: `"type": "module"` in a workspace package causes ESM/CJS conflicts between Node.js (ts-node/tsx) and bundlers (Turbopack/webpack). Avoid it. Let the consumer handle compilation.

---

## 4. Data Model

### Model Schema (core fields)

```typescript
// Filled by user (required):
name: string
description: string          // min 20 chars
version: string              // semver, default '1.0.0'
task: Task                   // enum
framework: Framework         // enum
license: License             // SPDX enum

// Filled by user (optional — increases provenance score):
baseModel: IParentRef[]      // lineage — empty = from_scratch
trainingData: ITrainingData  // datasets, summary
tags: string[]
evaluation: IEvaluation      // benchmarks, limitations
languages: string[]
intendedUse: string          // EU AI Act Annex IV
size: number                 // MB

// Filled by system (user cannot set):
ownerAddress: string         // from SIWE session
modelHash: string            // blake3, client-side
modelFileCid: string         // Pinata upload
metadataCid: string          // Pinata upload (metadata JSON)
onChainRegistered: boolean   // default false
blockchain: IBlockchainRecord
createdAt: Date
```

### Provenance Score Logic
```
Bronze (base):  onChainRegistered=true + modelHash + license
Silver (+20):   baseModel filled + 1+ dataset + description > 50 chars
Gold (+20):     evaluation.benchmarks filled + intendedUse + languages
```

### IParentRef
```typescript
{
  source: 'handshake' | 'huggingface' | 'other'
  name: string
  relationship: 'finetune' | 'adapter' | 'quantized' | 'merge' | 'knowledge_distillation'
  handshakeId?: string   // only when source === 'handshake'
  externalId?: string    // HF repo ID or URL
  modelHash?: string     // only when source === 'handshake', verified by backend
}
```

---

## 5. API Design

```
POST   /auth/nonce           → { nonce, expiresAt }
POST   /auth/verify          → sets session cookie
GET    /auth/me              → { authenticated, walletAddress }
POST   /auth/logout          → clears cookie

GET    /models               → { models[], total } (query: owner, task, page)
POST   /models               → { model } — requires auth
GET    /models/:id           → { model }
GET    /models/check/:hash   → { exists, modelId? }
PATCH  /models/:id/blockchain → { model } — requires auth + owner check

GET    /pinata/signed-url    → { signedUrl } — requires auth
```

---

## 6. Auth Flow (SIWE)

```
  Browser (Wagmi)               API (NestJS)                MongoDB
       │                             │                          │
       │  GET /auth/nonce            │                          │
       │────────────────────────────>│                          │
       │                             │  generate nonce          │
       │                             │─────────────────────────>│
       │                             │  save { nonce, used:false, expiresAt: +10min }
       │  { nonce, expiresAt }       │                          │
       │<────────────────────────────│                          │
       │                             │                          │
  ┌────┴────┐                        │                          │
  │ Wallet  │  user signs            │                          │
  │ signs   │  SIWE message          │                          │
  └────┬────┘  (client-side only)    │                          │
       │                             │                          │
       │  POST /auth/verify          │                          │
       │  { message, signature }     │                          │
       │────────────────────────────>│                          │
       │                             │  1. parse SIWE message   │
       │                             │  2. verify signature     │
       │                             │  3. check nonce exists   │
       │                             │     & not used           │
       │                             │  4. mark nonce used      │
       │                             │─────────────────────────>│
       │                             │  5. create session       │
       │                             │     { sessionId, walletAddress, expiresAt: +24h }
       │                             │─────────────────────────>│
       │  Set-Cookie: session=...    │                          │
       │  (HttpOnly, 24h)            │                          │
       │<────────────────────────────│                          │
       │                             │                          │
       │  subsequent requests        │                          │
       │  Cookie: session=...        │                          │
       │────────────────────────────>│                          │
       │                             │  AuthGuard:              │
       │                             │  findSession(sessionId)  │
       │                             │  → sets req.user = { walletAddress }
```

**Rules:**
- `ownerAddress` ALWAYS comes from `req.user.walletAddress` set by AuthGuard — never from body
- Nonce is single-use — replayed signatures are rejected
- Session is HTTP-only cookie — not accessible from JavaScript

---

## 7. Model Upload Flow (5-Step Wizard)

```
  Browser (Wizard)              API (NestJS)           Pinata (IPFS)        MongoDB
       │                             │                       │                  │
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │ Step 1 — File                   │                       │                  │
  │  user drops .safetensors/.bin   │                       │                  │
  │  blake3 hash computed in        │                       │                  │
  │  Web Worker (non-blocking)      │                       │                  │
  │                                 │                       │                  │
  │  GET /models/check/:hash        │                       │                  │
  │─────────────────────────────────>                       │                  │
  │  { exists: false }              │                       │                  │
  │<────────────────────────────────│                       │                  │
  │  (if exists: true → block)      │                       │                  │
  └────────────────────────────────────────────────────────────────────────────────┘
       │
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │ Step 2 — Identity               │                       │                  │
  │  name, description, task,       │                       │                  │
  │  framework, license, version    │                       │                  │
  └────────────────────────────────────────────────────────────────────────────────┘
       │
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │ Step 3 — Lineage                │                       │                  │
  │  from_scratch → baseModel=[]    │                       │                  │
  │  derived → IParentRef[] filled  │                       │                  │
  │  (source, name, relationship)   │                       │                  │
  └────────────────────────────────────────────────────────────────────────────────┘
       │
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │ Step 4 — Optional               │                       │                  │
  │  tags, benchmarks, limitations  │                       │                  │
  │  intendedUse, languages, size   │                       │                  │
  └────────────────────────────────────────────────────────────────────────────────┘
       │
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │ Step 5 — Summary & Confirm      │                       │                  │
  │  provenance score shown         │                       │                  │
  │  wallet address shown           │                       │                  │
  │  "Confirm & Upload" clicked     │                       │                  │
  └────────────────────────────────────────────────────────────────────────────────┘
       │
       │  1. GET /pinata/signed-url  │                       │                  │
       │─────────────────────────────>                       │                  │
       │  { signedUrl }              │                       │                  │
       │<────────────────────────────│                       │                  │
       │                             │                       │                  │
       │  2. Upload file directly ───────────────────────────>                  │
       │     to Pinata (signed URL)  │                       │                  │
       │     ← { cid: modelFileCid } │                       │                  │
       │                             │                       │                  │
       │  3. POST /models            │                       │                  │
       │     { all wizard fields,    │                       │                  │
       │       modelFileCid,         │                       │                  │
       │       modelHash }           │                       │                  │
       │─────────────────────────────>                       │                  │
       │                             │  AuthGuard: attach walletAddress         │
       │                             │                       │                  │
       │                             │  4. build metadata JSON                 │
       │                             │  5. upload metadata ───────────────────>│
       │                             │     ← { cid: metadataCid }              │
       │                             │                       │                  │
       │                             │  6. save to MongoDB ────────────────────>
       │                             │     { ...fields, ownerAddress,           │
       │                             │       metadataCid, onChainRegistered: false }
       │  { model }                  │                       │                  │
       │<────────────────────────────│                       │                  │
       │                             │                       │                  │
       │  [Phase 3] wallet signs TX  │                       │                  │
       │  PATCH /models/:id/blockchain ──────────────────────────────────────────>
```

**Key rules:**
- File goes directly to Pinata (signed URL) — never through the API server (avoids memory issues with large files)
- Metadata JSON is built and uploaded **server-side** — client sends all fields, server constructs the canonical JSON
- `ownerAddress` injected by AuthGuard, never trusted from client
- `onChainRegistered` starts as `false`, updated after blockchain TX confirmed (Phase 3)

---

## 8. Blockchain TX Flow (Phase 3)

```
  Browser                    API                    Avalanche C-Chain
     │                        │                            │
     │  model already saved   │                            │
     │  onChainRegistered=false                            │
     │                        │                            │
     │  wallet signs TX       │                            │
     │  registerModel(        │                            │
     │    modelHash,          │                            │
     │    metadataCid,        │                            │
     │    parentHash,         │                            │
     │    licenseType         │                            │
     │  )─────────────────────────────────────────────────>│
     │                        │                            │
     │  { txHash }            │                            │
     │  (show "pending TX")   │                            │
     │                        │                            │
     │                        │  EventListenerService      │
     │                        │  listens: ModelRegistered  │
     │                        │<───────────────────────────│
     │                        │                            │
     │                        │  update MongoDB:           │
     │                        │  onChainRegistered=true    │
     │                        │  blockchain.txHash=...     │
     │                        │                            │
     │  PATCH /models/:id/blockchain                       │
     │  (or event-driven update)                           │
     │                        │                            │
     │  badge: "Blockchain Verified" (Bronze)
```

**Rules:**
- API routes never `await` TX confirmation — return immediately with txHash
- EventListenerService (BullMQ worker) handles async MongoDB sync
- Frontend polls or uses websocket for status updates

---

## 8. Monorepo Rules

### pnpm Workspace
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'contracts'
```

### Turborepo Tasks
```json
{
  "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
  "dev":   { "cache": false, "persistent": true },
  "lint":  {},
  "test":  {}
}
```

### Adding Dependencies
```bash
pnpm add <pkg> --filter @handshake/api     # only to api
pnpm add <pkg> --filter @handshake/web     # only to web
pnpm add -D <pkg> -w                       # root devDep (turbo, typescript, etc.)
```

### Inter-package imports
```typescript
// In apps/api or apps/web:
import type { IModel } from '@handshake/types'
import { TaskEnum } from '@handshake/types'
// Never use relative paths to cross package boundaries
```

---

## 9. Coding Standards

### TypeScript
- All code TypeScript — no `any`, no `@ts-ignore`
- Use `type` imports for type-only imports: `import type { IModel } from '@handshake/types'`
- Enums as const objects or TypeScript `enum` — exported from `packages/types`

### NestJS Conventions
- One module per domain feature (`AuthModule`, `ModelModule`, `PinataModule`)
- Controllers: only HTTP parsing + delegation. Max ~15 lines per endpoint.
- Services: business logic only. Throw `DomainException` on errors.
- Repositories: Mongoose queries only. Return plain objects (`.lean()`)
- Guards: use `@UseGuards(AuthGuard)` — never call session logic in controller
- DTOs: `class-validator` decorators for NestJS pipes

### Next.js Conventions
- `"use client"` only when needed (interactivity, hooks)
- All API calls via TanStack Query — no `useEffect + fetch`
- Wizard state via `useReducer` — no prop drilling, no localStorage
- No sensitive data in URL params

### Error Handling
```typescript
// Backend — throw from service:
throw new DomainException('MODEL_NOT_FOUND', 404)

// Global filter catches and formats:
{ error: { code: 'MODEL_NOT_FOUND', message: '...' }, statusCode: 404 }

// Frontend — TanStack Query handles errors automatically
```

### Environment Variables
```bash
# apps/api/.env
PORT=4000
MONGO_URI=...
PINATA_JWT=...
SESSION_SECRET=...
CLIENT_URL=http://localhost:3000
NODE_ENV=development

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

**Never commit `.env` files. Always use `.env.example`.**

---

## 10. What NOT To Do

- **Never** `import mongoose from 'mongoose'` in a service or controller
- **Never** `import type` something from `'../../../packages/types'` — use `'@handshake/types'`
- **Never** read `ownerAddress` from request body — always from `req.user` (guard sets it)
- **Never** `await` a blockchain TX in a request handler — return txHash, handle async
- **Never** add `"type": "module"` to `packages/types/package.json`
- **Never** use `.js` extensions in `packages/types` internal imports
- **Never** commit secrets — use `.env` files
- **Never** use `useEffect + fetch` for data fetching in Next.js — use TanStack Query
- **Never** store wallet private keys anywhere in the app
- **Never** write business logic in NestJS controllers

---

## 11. Roadmap

### ✅ Phase 0 — PoC (Complete)
Basic upload → IPFS → MongoDB. No auth, no blockchain.

### ✅ Phase 1 — Wallet Auth (Complete)
Wagmi v2 + SIWE. Real wallet ownership. Protected endpoints.

### 🚧 Phase 2 — v2 Architecture (Current)
**Goal**: NestJS rewrite, clean monorepo, wizard UI

- [ ] NestJS scaffold (AuthModule, ModelModule, PinataModule)
- [ ] Shared types package (enums, interfaces, DTOs)
- [ ] SIWE auth with NestJS Guards
- [ ] 5-step upload wizard (Next.js)
- [ ] Repository layer (Mongoose queries isolated)
- [ ] Docker Compose (mongo + redis + api + web)
- [ ] GitHub Actions CI

### 📅 Phase 3 — Smart Contracts
**Goal**: Blockchain as source of truth

- [ ] `ModelRegistry.sol` on Avalanche Fuji
- [ ] BlockchainService + EventListenerService
- [ ] BullMQ workers for event → MongoDB sync
- [ ] Verification badges in UI

### 📅 Phase 4 — Provenance & Compliance
- [ ] EU AI Act compliance fields enforcement
- [ ] Lineage DAG visualization
- [ ] Badge system (Bronze → Platinum)
- [ ] Full-text search

### 📅 Phase 5 — Monetization
- [ ] Story Protocol integration (IP licensing)
- [ ] `AccessControl.sol` (paid downloads)
- [ ] Lit Protocol (encrypted model storage)

---

## 12. Verification Badge System

| Badge | Requirement | Phase |
|-------|-------------|-------|
| Bronze | On-chain record + modelHash + license | Phase 3 |
| Silver | + lineage declared + 1 dataset + description > 50 | Phase 4 |
| Gold | + benchmarks + intendedUse + languages | Phase 4 |
| Platinum | Security audit + ZKP training proof | Phase 5 |

---

## 13. Agent Roles (Claude Code)

### `fullstack-dev`
Frontend + backend implementation. NestJS modules, Next.js components, API endpoints, TanStack Query hooks.
**Trigger**: "implement X", "build Y component", "add Z endpoint"

### `web3-architect`
Smart contract design, SIWE flow, wallet integration, security audits.
**Trigger**: "design contract", "review security", "SIWE flow", "gas optimization"

### `handshake-project-manager`
Research, competitive analysis, EU AI Act requirements, roadmap tracking.
**Trigger**: "research X", "compare Y vs Z", "what's the status of..."

### How to use agents effectively
- Give ONE task per agent invocation
- Include domain context (e.g. "in the NestJS ModelModule, implement...")
- Agents read CLAUDE.md — don't repeat what's already here
- Run independent tasks in parallel (frontend + backend can build simultaneously)

---

## 14. Standards & References

| Standard | Use in Handshake |
|----------|-----------------|
| EIP-4361 (SIWE) | Wallet authentication |
| ERC-7857 | NFT standard for AI models (Phase 3) |
| EU AI Act Annex IV | Training data disclosure fields |
| W3C PROV | Provenance graph format |
| HuggingFace Model Cards | Metadata template inspiration |
| C2PA | Content provenance (future consideration) |

**Key Docs**:
- [NestJS Docs](https://docs.nestjs.com/)
- [Wagmi v2](https://wagmi.sh/)
- [Pinata SDK v3](https://docs.pinata.cloud/)
- [Avalanche Dev Docs](https://docs.avax.network/)
- [TanStack Query v5](https://tanstack.com/query/v5)
