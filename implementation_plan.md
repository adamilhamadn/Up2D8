# Up2D8: Master Project Workflow

This document outlines the strict, step-by-step workflow we will follow to take Up2D8 from raw concepts to a production-ready React Native app. We will use a phased approach, ensuring visual and interactive perfection before we commit to heavy engineering.

## User Review Required

> [!IMPORTANT]
> Please review this workflow. If you agree with the phases and the division of labor, click **Proceed**. If you want to adjust the process, let me know in the chat. 

## Phase 1: Visual Design & Concepting (We are here)

**Goal:** Lock in the visual truth (layout, spacing, monochrome aesthetic) without writing production code.

1.  **Define the Screen:** You tell me which screen to design (e.g., Drafts Inbox, Timeline, Settings).
2.  **Skill Usage (`/ui-ux-pro-max`):** I will query our internal design intelligence database to pull the exact spacing, typography, and contrast rules required for a "Things 3" style productivity app.
3.  **Visual Generation:** I will use my image generation tools to create a high-fidelity visual mockup of the screen.
4.  **Critique (`/batch-grill-me`):** You act as the ruthless reviewer. We stress-test the visual design until it perfectly matches `DESIGN.md`.

## Phase 2: Interactive Web Sandboxing

**Goal:** Validate mobile ergonomics, touch targets, and responsive behavior in a browser before touching React Native.

1.  **Skill Usage (`/impeccable` & `/ui-styling`):** Operating at an award-winning craft level, I will write isolated HTML/Tailwind prototypes in a `sandbox/` directory. These will map exactly to the approved visual mockups.
2.  **Device Testing:** You will open these HTML files on your actual physical phone.
3.  **The "Feel" Test:** You test thumb-reach, tap targets, and layout collapse. We iterate on the Tailwind classes in the sandbox until the ergonomics are flawless.

## Phase 3: Expo / React Native Foundation

**Goal:** Scaffold the actual production codebase in the correct stack (`PRODUCT.md`).

1.  **Initialization:** I will run `npx create-expo-app@latest -t expo-template-blank-typescript` to build the cross-platform shell.
2.  **Dependencies:** I will install and configure `NativeWind` (for translating our Tailwind sandbox styles), `react-native-reanimated`, `react-native-gesture-handler`, and `expo-haptics`.
3.  **Verification:** You run the app in the Expo Go app or iOS Simulator to ensure the blank shell compiles successfully.

## Phase 4: Component Translation & Polish

**Goal:** Port the approved HTML/Tailwind sandboxes into React Native components.

1.  **Translation:** I will systematically convert our sandbox `<div>` elements into `<View>` elements, applying the exact same NativeWind `className` props we perfected in Phase 2.
2.  **Motion & Haptics:** I will wire up `expo-haptics` to all buttons and implement `react-native-reanimated` for smooth card collapses and swipe gestures.
3.  **Verification:** You test the translated components on-device to ensure the native feel matches the web sandbox.

## Phase 5: Logic, State & Integrations

**Goal:** Make the app actually work with real data.

1.  **Local Database:** Set up `Expo SQLite` for offline-first task storage.
2.  **Backend Hooks:** Connect `Supabase` for syncing and the Telegram Bot Bridge.
3.  **Native Features:** Implement `expo-notifications` for hardware-level reminders and build the iOS/Android Home Screen Widgets.
4.  **Final Polish (`/impeccable polish`):** We run a final pass to ensure edge cases, empty states, and loading states are gorgeous.

---

## Open Questions

- We currently have the `Up2D8 (Ai Studio)` folder taking up space. Shall I delete it entirely as part of Phase 1 cleanup so we don't accidentally reference its flawed code?
- Which core screen do you want to start Phase 1 with? (Drafts Inbox, Timeline, or Category Hubs?)
