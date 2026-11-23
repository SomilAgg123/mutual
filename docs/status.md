# What works and what is preserved

The portfolio edition has a deliberately small supported runtime: the standalone matching example. The historical mobile app and Flask API are available for inspection and future development.

| Capability | State | Evidence / remaining work |
| --- | --- | --- |
| Fictional matching example | Runnable | Terminal and JSON output; no external packages or services |
| Similarity/complementarity scoring | Tested | Normalization, validation, missing data, reciprocal preferences, symmetric results |
| Original screens and components | Preserved | 29 screen files plus reusable controls and state contexts |
| Sign-in and sign-up | Incomplete prototype | App bypasses authentication; token endpoint has an unconditional authorization stub |
| Onboarding | Incomplete prototype | Screens exist; navigator/provider wiring needs repair |
| Search and matchmaker activity | Partly fixture-driven | Replace hardcoded lists with consistent backend contracts |
| Profile editing | Incomplete prototype | Similarity/complementarity edit screens are stubs; other forms have placeholder data |
| Creating an introduction | Partially implemented | Does not create the conversation link needed by chat; frontend request lifecycle needs deduplication |
| Chat | Partially implemented | Socket events and persistence exist; authorization, endpoint consistency, reconnection, and participant identity need repair |
| Photos | Historical cloud integration | S3/DynamoDB configuration and original account assets are not included |
| Native builds | Not verified | Expo 47 / React Native 0.70-era source; dependency and native-project migration required |
| Database recreation | Not supported | Existing migration does not describe the application schema |
| Public API deployment | Not supported | Historical API import is disabled by default |

## Verification

Local validation on 23 November 2026 used Python 3.13.1. All 19 tests and the documented example passed in a clean temporary copy with site packages disabled. The suite also runs the CLI from a separate working directory. This confirms that the documented example does not depend on the original environments. The committed example output matches the actual CLI output.

Python syntax, JSON files, local JavaScript imports, and documentation links passed the repository checks. All 57 imported JavaScript/JSX files were also parsed locally using the original checkout's Babel parser; this is syntax verification, not a native build or an integration test. A private comparison against four distinct historical credential values found no copies in the curated files; the values themselves are not stored in this edition.

The GitHub Actions workflow is configured for Python 3.10 and 3.13, following the documented usage of [checkout](https://github.com/actions/checkout) and [setup-python](https://github.com/actions/setup-python). Remote CI results are not claimed before publication.

## If the full app is revived later

1. Choose one identity/authentication system and enforce user and conversation ownership on both HTTP and socket operations.
2. Reconcile account/profile IDs and create migrations for the real schema.
3. Complete the profile → introduction → linked conversation → chat flow against seeded local data.
4. Centralize the mobile API client and replace fixture-only screens, mismatched routes, and render-triggered writes.
5. Upgrade the mobile toolchain, regenerate native scaffolding, and test on devices.
6. Provision new infrastructure only after the application flow and authorization are tested.

Those steps are outside the completed matching-demo scope; this repository does not present them as working features.
