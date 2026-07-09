# ETD — Explain The Defender: Architecture & Structure Guide

Welcome to the ETD (Explain The Defender) codebase. This document provides structural context and architectural guidance for navigating and extending the platform.

## Directory Structure (Feature-Sliced Design)

The application follows a modular, feature-sliced architecture. This means code is grouped by domain/feature rather than by file type, ensuring high cohesion and easier maintainability.

```text
src/
├── core/                # Core business logic and pure functions (Engines)
│   ├── KnowledgeEngine.ts  # Traverses the static KB graph (Detections -> Investigations -> Responses)
│   └── NarrativeEngine.ts  # Translates technical telemetry into educational narratives
│
├── data/                # Mock data and global constants
│   ├── defenseChain.ts     # The 7-stage ETD Defense Chain definitions
│   └── mockIncidents.ts    # Seed data for incidents and alerts
│
├── knowledge-base/      # The static intelligence graph (The "Brain" of ETD)
│   ├── event-intel/        # Detection signatures (e.g., Windows Event Logs, Sysmon)
│   ├── investigation/      # Analyst questions mapped to detections
│   ├── response/           # Playbook actions mapped to detections
│   └── threats/            # APT profiles mapped to MITRE techniques
│
├── types/               # Global TypeScript definitions
│   ├── index.ts            # Primary export barrel
│   ├── knowledge.ts        # Types for the static KB graph
│   ├── narrative.ts        # Types for the generated reports
│   └── ...                 
│
├── styles/              # Global CSS and Tailwind directives
│   └── index.css           # Contains ETD Design System classes (.glass, .etd-card)
│
├── components/          # Shared, cross-feature UI components
│   └── layout/             # Global wrappers (Sidebar, Topbar, Layouts)
│
└── features/            # Feature-specific modules (Pages and localized components)
    ├── analysis/           # Analysis Dashboard
    ├── core/               # Public Landing / Home Dashboard
    ├── investigate/        # Investigation Workbench UI
    ├── knowledge-base/     # Tactics Explorer UI
    ├── mitre/              # MITRE ATT&CK Matrix UI
    ├── playbooks/          # Playbooks Engine UI
    ├── reports/            # Incident Report Generator UI
    └── status/             # Platform Health UI
```

## Core Concepts

### 1. The Defense Chain™
Unlike the traditional Cyber Kill Chain (which tracks the attacker), ETD utilizes a proprietary 7-stage **Defense Chain**:
`DETECT` ➔ `TRIAGE` ➔ `INVESTIGATE` ➔ `CONTAIN` ➔ `ERADICATE` ➔ `RECOVER` ➔ `IMPROVE`

### 2. Educational Levels
The platform dynamically shifts its narrative tone based on the user's selected persona:
- **Student:** Uses analogies and simplifies concepts (e.g., "The attacker is like a burglar").
- **Analyst:** Uses standard SOC terminology.
- **Responder:** Uses BLUF (Bottom Line Up Front) and focuses on immediate actionable intel.

### 3. The Static Intelligence Graph
ETD ships with a built-in "Knowledge Base" (in `src/knowledge-base/`) that maps low-level telemetry (like Windows Event `4625`) to high-level Analyst Questions, Response Actions, and MITRE Techniques. The `KnowledgeEngine` is responsible for querying this graph.

## Design System
The UI relies heavily on a "Dark Navy" / "Cyber Black" theme with glassmorphism.
Avoid using ad-hoc colors. Rely on the variables defined in `tailwind.config.js` and the global `.glass` / `.etd-card` classes in `src/styles/index.css`.

- **Primary Accent:** Defender Blue (`brand-defenderBlue`)
- **Secondary Accent:** Security Green (`brand-securityGreen`)
- **Alerts:** Critical Red (`eradicate`)
