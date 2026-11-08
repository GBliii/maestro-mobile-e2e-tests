# Wikipedia Android — E2E tests with Maestro

End-to-end UI tests for the [Wikipedia Android app](https://github.com/wikimedia/apps-android-wikipedia), written with [Maestro](https://maestro.dev).

A portfolio project: test design, stable selectors and independent tests that don't depend on screen size or on today's content.

## What is covered

| # | Test | Type | Tag |
|---|------|------|-----|
| 01 | Onboarding on the first launch | positive | `smoke` |
| 02 | Search for an article and open it | positive | `smoke` |
| 03 | Search with no results, clear the query | negative | `regression` |
| 04 | Save an article, restart the app, find it in Saved | positive, data persistence | `regression` |
| 05 | Community feed: today's date and the Featured article card | positive, dynamic content | `regression` |

Test cases, priorities and risks: [TEST_PLAN.md](TEST_PLAN.md).

## How the tests are built

- **Independent tests.** Each test starts from a clean app state (`clearState`) and goes through onboarding in a shared subflow, so tests can run in any order.
- **Stable selectors.** Elements are found by id or visible text, never by screen coordinates.
- **No fixed sleeps.** Network content is awaited with `extendedWaitUntil`.
- **Resilient to UI changes.** Onboarding is passed with a `repeat … while` loop, so a different number of intro screens doesn't break the tests; an optional promo sheet is handled with a conditional `runFlow`.
- **Dynamic data.** The Community feed changes every day: the test computes today's date in JavaScript and reads the Featured article title from the screen (`copyTextFrom`) instead of hard-coding it. The title is regex-escaped before it is used as a selector.

## Project structure

```
flows/        # tests
subflows/     # reusable steps: clean start + onboarding, open search
scripts/      # JavaScript helpers: today's date, regex escaping
config.yaml   # Maestro workspace config
TEST_PLAN.md  # test cases, priorities, risks
```

## How to run

Requirements: [Maestro CLI](https://docs.maestro.dev) 2.x, Java 17+, an Android emulator with internet access.

```bash
# 1. Get the app: Maestro's sample build of Wikipedia
maestro download-samples
adb install maestro-samples/wikipedia.apk   # path printed by the previous command

# 2. Run all tests
maestro test .

# Only smoke tests
maestro test . --include-tags=smoke

# One test
maestro test flows/02-search-article.yaml
```

Tested on: Android emulator Pixel 6 Pro, API 33, Maestro CLI 2.12, Wikipedia sample build from `maestro download-samples`.

## Demo

Recorded with `maestro record`: test steps on the left, the emulator on the right.

**02 — Search for an article and open it** (also shows the optional promo sheet being closed by a conditional `runFlow`)

![Search for an article](docs/demo-02-search-article.gif)

**03 — Search with no results, clear the query**

![Search with no results](docs/demo-03-search-no-results.gif)

## Author

Gerta — QA Engineer · [GitHub](https://github.com/GBliii)
