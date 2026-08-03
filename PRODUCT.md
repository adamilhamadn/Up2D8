# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

React Native + Expo Router v3 + NativeWind (Tailwind CSS) + Supabase + Expo SQLite + expo-notifications

## Users

University students who need to track coursework, project deadlines, exam dates, and campus announcements scattered across Ulearn, Telegram groups, slides, and syllabuses.

## Product Purpose

Up2D8 aggregates messy academic deadlines into an aesthetic, distraction-free mobile workspace. It replaces manual calendar entry with AI-assisted parsing (Smart Paste & Smart Upload) and Telegram forwarding, offering 1-tap native hardware phone reminders, home screen widgets, and unlisted schedule link sharing.

## Positioning

Unlike generic calendar tools or bloated task managers, Up2D8 is a local-first, privacy-focused academic hub designed specifically for student workflows. It features a "Drafts Inbox" safety barrier against AI hallucinations, hardware-level reminders with zero background battery drain, and customizable color themes without AI slop.

## Operating Context

Students checking deadlines on mobile during commutes, late-night study sessions, and in-between lectures. Works 100% offline with zero latency via local SQLite database.

## Capabilities and Constraints

- **Ingestion**: Telegram Bot Bridge (pairing via 6-digit one-time code), Smart Paste (LLM text extraction), Smart Upload (in-memory Vision AI screenshot OCR).
- **Staging**: Drafts Inbox with confidence indicators and manual field fallbacks.
- **Categorization**: Category Hubs for Projects, Exams, Coursework, and University Announcements.
- **Notifications**: 1-tap Native Phone Reminders (`expo-notifications` local OS scheduling).
- **Sharing**: Unlisted deep links (`up2d8://share/:token`) for 1-tap schedule importing between classmates.
- **Visuals**: Dynamic Theme Switcher (Minimal Dark, Cyberpunk, Pastel Glow, Neon).

## Brand Commitments

- **Name**: Up2D8
- **Tone**: Clean, precise, effortless, high-density, non-slop.
- **Visual Style**: Aesthetic minimalism, micro-interactions, dark mode default, tactile feedback.

## Product Principles

1. **Zero AI Slop**: AI is an invisible assistant staging drafts, never an unverified decision-maker injecting unconfirmed dates into the user's schedule.
2. **Glanceable & Frictionless**: Important deadlines are reachable in 1 tap (Widgets, Native Phone Reminders, Category Hubs).
3. **Local-First & Private**: Student data loads instantly offline; raw Vision screenshots are processed in-memory and immediately discarded.
