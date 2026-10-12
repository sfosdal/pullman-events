# Pullman Events

Event feed and calendar for Pullman, WA and the Palouse: Martin Stadium,
Beasley Coliseum, Bohler Gymnasium and the CUB Ballroom on the WSU campus;
the Kibbie Dome, ICCU Arena and the Kenworthy in Moscow, ID; the Clearwater
River Casino and the Liberty Theatre in Lewiston — with the home teams'
seasons (Cougars and Vandals football and men's basketball) and Seattle's
Seahawks, Mariners and Kraken in a Teams view.

Live at **https://pullman.here.events/** once the domain is wired (GitHub
Pages, built by the Actions workflow once a day at noon Pacific).

A sister site on the lqa-events codebase: everything that makes this
Pullman's is `site/city.js` (every team, venue, type, default, share-code
registry and string), `site/index.html`, `scripts/fetch-events.mjs` (the
sources), `site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
`channels.json`, the manifest and icons (the Palouse hills, rendered from
`favicon.svg`). Everything else is lqa-events' own, byte for byte — copy from
there, never edit here.

## Embed

```html
<div id="pullman-events"></div>
<script src="https://pullman.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Ticketmaster Discovery API** — every room by its venue id (every page):
  nine rooms, the only ones Ticketmaster lists on the Palouse. There is no
  city sweep: a radius search around a college town pulls in Spokane. The
  market is small — a room stays listed when its calendar runs short. Church
  events are left out (`isChurch`). Calls are paced a second apart and back
  off on 429: the key is shared across the sister sites' builds.
- **Seasons** — ESPN for the Cougars and the Vandals (football and men's
  basketball; their home games are injected into the listing from the
  schedule where Ticketmaster has no entry — city.js `inject`) and the
  Seahawks; MLB's stats API for the Mariners; the NHL's for the Kraken
  (`scripts/schedules.mjs`, shared with lqa). College basketball shows no
  games before November: ESPN's plain schedule call answers with the
  preseason, and the shared adapter merges the regular season only for the
  NBA, so those two clubs sit in the filter panel without a Teams tab
  (`strip: false`) until then.

Next to add: the rooms Ticketmaster never lists (Gladish, Jones Theatre at
Daggy Hall, Bryan Hall, Moscow's 1912 Center, Zeppoz), from their own
calendars, and the Lentil Festival.

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
