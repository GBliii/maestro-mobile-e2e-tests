# Test plan — Mobile E2E (Android & iOS)

## Scope

**Android (Wikipedia):** onboarding, article search, saving articles, the Community feed.
Out of scope: account and login, article editing, offline mode, notifications, the personalized "For you" feed, tablets.

**iOS (Contacts):** creating, finding and deleting a contact; the new-contact form.
Out of scope: contact fields other than the name (phone, email, photo), lists/groups, sharing, iCloud sync.

## Environment

| | Android | iOS |
|---|---|---|
| App | Wikipedia for Android, Maestro sample build (`maestro download-samples`) | Contacts (built-in) |
| Device | Emulator Pixel 6 Pro, API 33 | Simulator iPhone 12 mini, iOS 16.4 |
| Tools | Maestro CLI 2.12, Java 17, macOS 13 | Maestro CLI 2.12, Xcode 14.3.1, macOS 13 |
| Network | Required: content is loaded from wikipedia.org | Not required |

Why Contacts on iOS: the Wikipedia iOS sample build requires iOS 16.6+, while the newest Xcode available on macOS 13 provides iOS 16.4 simulators. A built-in app needs no install and runs on any simulator.

## Test cases — Android

| ID | Title | Priority | Type | Steps | Expected result | Automated |
|----|-------|----------|------|-------|-----------------|-----------|
| TC-A01 | Onboarding on the first launch | High | Positive | Clean install, launch the app, go through all intro screens, skip topic personalization | Every screen shows its title; the main screen with the bottom navigation opens | [01-onboarding](android/flows/01-onboarding.yaml) |
| TC-A02 | Search for an article and open it | High | Positive | Open Search, type "Earhart", open "Amelia Earhart" | The article is in the results; the article screen opens | [02-search-article](android/flows/02-search-article.yaml) |
| TC-A03 | Search with no results, clear the query | Medium | Negative | Type a meaningless query, then tap the Clear button | "No results" is shown, the query stays in the field; after clearing, the field is empty and the message is gone | [03-search-no-results](android/flows/03-search-no-results.yaml) |
| TC-A04 | A saved article persists after restart | High | Positive | Open "Amelia Earhart", tap Save, restart the app, open Saved | The article is listed in Saved | [04-save-article](android/flows/04-save-article.yaml) |
| TC-A05 | Community feed: today's date and Featured article | Medium | Positive, dynamic data | Open the Community feed, read the Featured article title, tap it | The feed shows today's date; the article screen opens | [05-featured-article](android/flows/05-featured-article.yaml) |

## Test cases — iOS

| ID | Title | Priority | Type | Steps | Expected result | Automated |
|----|-------|----------|------|-------|-----------------|-----------|
| TC-I01 | Create and delete a contact | High | Positive, CRUD | Add a contact "Regina Phalange", go back to the list, delete it via Edit | The contact appears in the list after creation and disappears after deletion | [01-create-and-delete-contact](ios/flows/01-create-and-delete-contact.yaml) |
| TC-I02 | Search for a contact | Medium | Positive + negative | Create "Ken Adams"; search "Adams"; search "Dinosaur Guy" | "Ken Adams" is found; "No Results for "Dinosaur Guy"" is shown and no contact is listed | [02-search-contact](ios/flows/02-search-contact.yaml) |
| TC-I03 | New contact form: validation and cancel | Medium | Validation, negative | Tap Add; check Done; type a first name; check Done; type a last name; Cancel → Discard Changes | Done is disabled for an empty form and enabled once a name is entered; the discarded contact is not in the list | [03-cancel-new-contact](ios/flows/03-cancel-new-contact.yaml) |

## Candidates for the next iteration

- Android: remove an article from Saved; recent searches; topic personalization ("For you"); app language change; behaviour without internet (`setAirplaneMode`)
- iOS: edit an existing contact; add a phone number and check the call button becomes enabled; contact lists; Wikipedia iOS once an iOS 17 simulator (Xcode 15) is available
- Both: a second device size per platform; running the suites in CI

## Observations

- **Android: queries without results are saved to Recent searches.** After "blahblahchanandolerbong" returned "No results" and the query was cleared, it still appeared under "Recent searches:". Arguably the history should keep only queries that returned something; otherwise typos pile up in it. Not reported as a bug: it may be intended behaviour. TC-A03 documents the current behaviour.
- **iOS: the keyboard can swallow a tap.** In the new-contact form, tapping "add phone" while the keyboard is open hit a keyboard key instead: a letter was appended to the last name and the phone number was typed into it. Any step that taps a row below the keyboard must dismiss the keyboard first or scroll the row into view.
- **iOS: off-screen rows report wrong frames.** In the long edit form, `scrollUntilVisible` considered "Delete Contact" visible before it was on screen and tapped the wrong place. Scrolling with real swipes first fixes it; see `ios/subflows/delete-contact.yaml`.

## Risks and known limitations

- **Live data (Android).** The Community feed changes every day. TC-A05 reads the title from the screen, but a Featured article whose displayed title differs from the card title (diacritics, italics) could break a stricter check.
- **Selectors without ids (Android).** Search results and feed cards have no resource ids in this build, so they are addressed by text or by position relative to other elements (`below`). A redesign of a card can break those selectors.
- **Article titles as text selectors.** Maestro text selectors are regular expressions; titles are escaped in `android/scripts/escape-regex.js`.
- **Shared state (iOS).** Built-in apps cannot be reset with `clearState`; tests create their own data and delete it. A test interrupted in the middle leaves a contact behind, so TC-I01 and TC-I02 remove leftovers before they start.
- **Localization.** All text selectors are English; both the emulator and the simulator must run in English.
- **App builds.** The Android sample build differs from the Google Play version and from the version described in Maestro docs (different onboarding, no "Top read" block); selectors are verified on the sample build only.
