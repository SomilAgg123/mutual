# Preserved mobile prototype

This directory contains Mutual's original React Native UI, based on Expo 47, React 18, and React Native 0.70. It retains the screen layouts, purple palette, reusable question controls, navigation, state contexts, and native project source.

**It is historical source, not the supported runnable demo.** Start with [the repository quickstart](../README.md) to run the matching example.

## Source tour

- [App.js](App.js): providers, tab navigation, and screen stacks.
- [Onboarding](src/screens/Onboarding): the original questionnaire.
- [Source](src/screens/Source): profile browsing and introduction entry point.
- [Arrange](src/screens/Arrange): comparisons, explanations, icebreakers, and confirmation.
- [Chat](src/screens/Chat): conversation UI and Socket.IO usage.
- [Profile](src/screens/Profile): settings and profile-editing screens, including unfinished views.
- [Components](src/components): buttons, profile cards, questions, and score displays.

## What changed during preservation

The package manifest now lists application/configuration dependencies instead of hundreds of transitive packages. Its versions remain historical. It has not been installed or validated as a compatible modern dependency set; no lockfile is supplied and `npm ci` is not a supported command for this snapshot.

Old service URLs now point to localhost. Real contact placeholders were replaced with example data. Unverified portrait photos were replaced with generated geometric avatars. Lato and its bundled license are retained; unverified SeoulHangang binaries were omitted and their font aliases use Lato. See [asset notes](../docs/assets.md).

The optional [review captures](../docs/screenshots/README.md) render eight preserved screens with browser adapters and offline fixtures. Rendering required small declaration fixes: comparison route parameters now precede the effects that read them, request URLs in the captured screens are local constants, and score-circle helpers are locally declared. Layouts remain unchanged.

The [public walkthrough](../site/README.md) also renders the original icebreaker-selection screen. Its request URLs are locally scoped and two unused imports were removed. The website's tour controls are separate from the inactive app controls.

The `ios/` and `android/` directories preserve native source for reference. Signing identities, the Android debug keystore, and the binary Gradle wrapper were omitted. They must be regenerated during a future native build migration.

The package scripts describe the intended Expo entry points, but they are not a working setup guide. Authentication/onboarding wiring, data contracts, image handling, and obsolete dependencies still need work. In particular, the current app entry point goes directly to the app navigator and the historical chat and profile requests do not form a verified complete flow.

No mobile build, simulator run, or current-device support is claimed. [Feature status](../docs/status.md) lists the known gaps.
