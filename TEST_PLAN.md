# Test plan — Wikipedia Android (E2E)

## Scope

**In scope:** onboarding, article search, saving articles, the Community feed.

**Out of scope:** account and login, article editing, offline mode, notifications, the personalized "For you" feed, tablets.

## Environment

- App: Wikipedia for Android, Maestro sample build (`maestro download-samples`)
- Device: Android emulator Pixel 6 Pro, API 33
- Tools: Maestro CLI 2.12, Java 17
- Internet connection is required: content is loaded from wikipedia.org

## Test cases

| ID | Title | Priority | Type | Steps | Expected result | Automated |
|----|-------|----------|------|-------|-----------------|-----------|
| TC-01 | Onboarding on the first launch | High | Positive | Clean install, launch the app, go through all intro screens, skip topic personalization | Every screen shows its title; the main screen with the bottom navigation opens | [01-onboarding](flows/01-onboarding.yaml) |
| TC-02 | Search for an article and open it | High | Positive | Open Search, type "Earhart", open "Amelia Earhart" | The article is in the results; the article screen opens | [02-search-article](flows/02-search-article.yaml) |
| TC-03 | Search with no results, clear the query | Medium | Negative | Type a meaningless query, then tap the Clear button | "No results" is shown, the query stays in the field; after clearing, the placeholder is back and the message is gone | [03-search-no-results](flows/03-search-no-results.yaml) |
| TC-04 | A saved article persists after restart | High | Positive | Open "Amelia Earhart", tap Save, restart the app, open Saved | The article is listed in Saved | [04-save-article](flows/04-save-article.yaml) |
| TC-05 | Community feed: today's date and Featured article | Medium | Positive, dynamic data | Open the Community feed, read the Featured article title, tap it | The feed shows today's date; the article screen opens | [05-featured-article](flows/05-featured-article.yaml) |

## Candidates for the next iteration

- Remove an article from Saved
- Recent searches: shown and can be cleared
- Topic personalization ("For you" feed): select topics, check the feed
- Change the app language and open an article in another language
- Behaviour without internet (`setAirplaneMode`)

## Observations

- **Queries without results are saved to Recent searches.** After "blahblahchanandolerbong" returned "No results" and the query was cleared, it still appeared under "Recent searches:". Arguably the history should keep only queries that returned something; otherwise typos pile up in it. Not reported as a bug: it may be intended behaviour. TC-03 documents the current behaviour.

## Risks and known limitations

- **Live data.** The Community feed changes every day. TC-05 reads the title from the screen, but a Featured article whose displayed title differs from the card title (diacritics, italics) could break a stricter check.
- **Selectors without ids.** Search results and feed cards have no resource ids in this build, so they are addressed by text or by position relative to other elements (`below`). A redesign of a card can break those selectors.
- **Article titles as text selectors.** Maestro text selectors are regular expressions; titles are escaped in `scripts/escape-regex.js`.
- **Network.** Tests need internet; waits are set to 15–30 s for slow connections.
- **App build.** The sample build differs from the Google Play version and from the version described in Maestro docs (different onboarding, no "Top read" block); selectors are verified on the sample build only.
- **One device size** has been tested so far.
