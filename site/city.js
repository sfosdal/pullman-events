// The city — every fact that makes this calendar Pullman's rather than
// another town's, in one place (2026-10-11: a sister of lqa-events, built
// from the Chicago copy). The browser (filter.js, app.js) and the build
// (scripts/*.mjs) both read it; nothing else names a venue or a team. The
// shared files (app.js, filter.js, styles.css bar its --v-* hues,
// scripts/*.mjs bar fetch-events.mjs and sources.mjs) are lqa-events' own,
// byte for byte — see README "Sister sites".
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right. Per team:
  //   re        the title match
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   espn      ESPN's sport/league/team id — the college clubs' seasons,
  //             form and news come from there (schedules.mjs); the Mariners'
  //             season from MLB's stats API and the Kraken's from the NHL's
  //   inject    the club's home games enter the listing from the league's
  //             schedule (fetch-events.mjs) when no ticket feed carries them
  //   strip     false = a filter row but no Teams tab. The two basketball
  //             clubs: ESPN's plain schedule call returns the preseason
  //             (empty) until November, and the shared adapter merges the
  //             regular season only for the NBA, so until the season is
  //             under way the clubs have no games to show
  //   club      the club's name on Ticketmaster; news the outlets' feeds;
  //             wiki the article (teamPage: a college programme's page, not
  //             the university's); opens when the season usually starts
  // The last three are Seattle's clubs, 290 miles west: Teams-view-only, so
  // the Palouse can follow the Seahawks, Mariners and Kraken from here —
  // their grounds are not Pullman venues and nothing of theirs is listed.
  var ST = function (s) { return ['https://www.seattletimes.com/sports/' + s + '/feed/', 'Seattle Times']; }; // the Seattle clubs' beat
  var TEAMS = [
    { slug: 'cougars', label: 'Cougars', name: 'Washington State Cougars', abbr: 'WSU', re: /cougars?\s+football|washington state football/i, sport: 'football', venue: 'Martin Stadium', colors: ['#981e32', '#5e6a71'],
      espn: { sport: 'football', league: 'college-football', id: '265' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://wsucougars.com/sports/football/schedule', name: 'Washington State Cougars Football' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/265.png', schedule: 'https://wsucougars.com/sports/football/schedule',
      club: 'Washington State Cougars', opens: 'late August', wiki: { title: 'Washington State Cougars football', teamPage: true },
      news: [['https://wsucougars.com/rss?path=football', 'WSUCougars.com'], ST('wsu-cougar-football')] },
    { slug: 'cougarshoops', label: 'Cougars Hoops', name: 'Washington State Cougars', abbr: 'WSU', re: /cougars?\s+(?:men'?s\s+)?basketball|washington state (?:men'?s\s+)?basketball/i, sport: 'basketball', venue: 'Beasley Coliseum', colors: ['#981e32', '#5e6a71'],
      espn: { sport: 'basketball', league: 'mens-college-basketball', id: '265' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://wsucougars.com/sports/mens-basketball/schedule', name: 'Washington State Cougars Basketball' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/265.png', schedule: 'https://wsucougars.com/sports/mens-basketball/schedule',
      club: 'Washington State Cougars', opens: 'November', wiki: { title: "Washington State Cougars men's basketball", teamPage: true },
      news: [['https://wsucougars.com/rss?path=mbball', 'WSUCougars.com']] },
    // Across the state line: Moscow's Vandals, eight miles east
    { slug: 'vandals', label: 'Vandals', name: 'Idaho Vandals', abbr: 'IDHO', re: /vandals?\s+football|idaho football/i, sport: 'football', venue: 'Kibbie Dome', colors: ['#b3a369', '#191919'],
      espn: { sport: 'football', league: 'college-football', id: '70' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://govandals.com/sports/football/tickets', name: 'Idaho Vandals Football' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/70.png', schedule: 'https://govandals.com/sports/football/schedule',
      club: 'Idaho Vandals', opens: 'late August', wiki: { title: 'Idaho Vandals football', teamPage: true },
      news: [['https://govandals.com/rss?path=football', 'GoVandals.com']] },
    { slug: 'vandalshoops', label: 'Vandals Hoops', name: 'Idaho Vandals', abbr: 'IDHO', re: /vandals?\s+(?:men'?s\s+)?basketball|idaho (?:men'?s\s+)?basketball/i, sport: 'basketball', venue: 'ICCU Arena', colors: ['#b3a369', '#191919'],
      espn: { sport: 'basketball', league: 'mens-college-basketball', id: '70' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      inject: { url: 'https://govandals.com/sports/mens-basketball/schedule', name: 'Idaho Vandals Basketball' },
      logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/70.png', schedule: 'https://govandals.com/sports/mens-basketball/schedule',
      club: 'Idaho Vandals', opens: 'November', wiki: { title: "Idaho Vandals men's basketball", teamPage: true },
      news: [['https://govandals.com/rss?path=mbball', 'GoVandals.com']] },
    // Seattle's clubs, as everett-events carries them (keep in step with it)
    { slug: 'seahawks', label: 'Seahawks', re: /seahawks/i, sport: 'football', venue: 'Lumen Field', colors: ['#002244', '#69be28'],
      espn: { sport: 'football', league: 'nfl', id: '26' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', schedule: 'https://www.seahawks.com/schedule/',
      club: 'Seattle Seahawks', opens: 'September', wiki: { title: 'Seattle Seahawks', startYear: true },
      news: [ST('seahawks'), ['https://www.seahawks.com/rss/news', 'Seahawks.com'], ['https://www.fieldgulls.com/rss/current.xml', 'Field Gulls']],
      youtube: ['UCzkFCRiMcOBeef8xcaqipmw', 'UCDVYQ4Zhbm3S2dlz7P1GBDg'] }, // @Seahawks, @NFL
    { slug: 'mariners', label: 'Mariners', re: /mariners/i, sport: 'baseball', venue: 'T-Mobile Park', colors: ['#0c2c56', '#005c5c'],
      espn: { sport: 'baseball', league: 'mlb', id: '12' }, season: { kind: 'mlb', id: 136 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png', schedule: 'https://www.mlb.com/mariners/schedule',
      club: 'Seattle Mariners', opens: 'late March', wiki: { title: 'Seattle Mariners' },
      division: ['HOU', 'LAA', 'ATH', 'TEX'], // AL West, by the abbreviations the schedule carries (ATH since the Athletics left Oakland)
      news: [ST('mariners'), ['https://www.mlb.com/mariners/feeds/news/rss.xml', 'MLB.com'], ['https://www.lookoutlanding.com/rss/current.xml', 'Lookout Landing']],
      youtube: ['UCWWLs-O8JGYYcNea7AgumAA'] }, // @mariners (MLB's clips come from statsapi)
    { slug: 'kraken', label: 'Kraken', re: /kraken/i, sport: 'hockey', venue: 'Climate Pledge Arena', colors: ['#001628', '#99d9d9'],
      espn: { sport: 'hockey', league: 'nhl', id: '124292' }, season: { kind: 'nhl', abbrev: 'SEA' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/sea.png', schedule: 'https://www.nhl.com/kraken/schedule',
      club: 'Seattle Kraken', opens: 'early October', wiki: { title: 'Seattle Kraken' },
      news: [ST('kraken'), ['https://www.nhl.com/kraken/rss/news', 'NHL.com']] },
  ];

  // The venues, one record each — the campus and downtown first by size,
  // then the Palouse: Moscow across the line and Lewiston down the grade.
  // Per venue:
  //   capacity how many people the place holds
  //   area     'town' for Moscow and Lewiston (the panel's second group);
  //            absent = Pullman, the campus and downtown
  //   type     the event type when the title decides nothing
  //   cssVar   the hue styles.css sets for it (dark block --v-*); color
  //            the same hue as a value, for the series graph
  //   url      the venue's own events listing — not a ticket vendor
  //   icon     a mark for listings without a team crest
  //   tm       its Ticketmaster Discovery listing (fetch-events.mjs reads
  //            the venue by id — every page). The market is small: only
  //            the rooms Ticketmaster actually lists are here. Gladish, Jones
  //            Theatre, Bryan Hall, the 1912 Center and Zeppoz have no feed
  //   alias    the other spellings the feeds use for it, folded to this name
  // No festivals yet, so the panel's Festivals group folds away (app.js).
  var VENUES = {
    // --- Campus and downtown: WSU's grounds and halls ---
    'Martin Stadium': {
      geo: [46.7318, -117.16037],
      capacity: 32952,
      type: 'sports',
      cssVar: '--v-martin',
      color: '#ea8686',
      url: 'https://wsucougars.com/sports/football/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=wsucougars.com&sz=128',
      tm: { id: 'KovZpZA1JA7A', match: 'martin stadium', fallbackUrl: 'https://wsucougars.com/sports/football/schedule', exclude: /parking/i },
      alias: /martin stadium|gesa field/i,
    },
    'Beasley Coliseum': {
      geo: [46.73524, -117.15811],
      capacity: 12000,
      type: 'concert',
      cssVar: '--v-beasley',
      color: '#86eaa3',
      url: 'https://beasley.wsu.edu/events/',
      icon: 'https://www.google.com/s2/favicons?domain=beasley.wsu.edu&sz=128',
      tm: { id: 'KovZ917AVAY', match: 'beasley', fallbackUrl: 'https://beasley.wsu.edu/events/', exclude: /parking/i },
      alias: /beasley/i, // Ticketmaster also lists it as the Beasley Performing Arts Center
    },
    'Bohler Gymnasium': {
      geo: [46.7329, -117.1622],
      capacity: 2500,
      type: 'sports',
      cssVar: '--v-bohler',
      color: '#c086ea',
      url: 'https://wsucougars.com/sports/womens-volleyball/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=wsucougars.com&sz=128',
      tm: { id: 'Z7r9jZadXm', match: 'bohler', fallbackUrl: 'https://wsucougars.com/sports/womens-volleyball/schedule' },
      alias: /bohler/i,
    },
    'CUB Senior Ballroom': {
      geo: [46.73115, -117.16267],
      capacity: 1000,
      type: 'concert',
      cssVar: '--v-cub',
      color: '#eadd86',
      url: 'https://cub.wsu.edu/',
      icon: 'https://www.google.com/s2/favicons?domain=cub.wsu.edu&sz=128',
      tm: { id: 'ZFr9jZ17ek', match: 'cub', fallbackUrl: 'https://cub.wsu.edu/' },
      alias: /cub (?:senior )?ballroom|compton union/i,
    },
    // --- Around the Palouse (`area: 'town'`): Moscow, ID — eight miles east — and Lewiston, ID, down the grade ---
    'Kibbie Dome': {
      geo: [46.72624, -117.01744],
      area: 'town',
      capacity: 16000,
      type: 'sports',
      cssVar: '--v-kibbie',
      color: '#86d9ea',
      url: 'https://govandals.com/sports/football/schedule',
      icon: 'https://www.google.com/s2/favicons?domain=govandals.com&sz=128',
      tm: { id: 'ZFr9jZk116', match: 'kibbie', fallbackUrl: 'https://govandals.com/sports/football/schedule', exclude: /parking/i },
      alias: /kibbie|cowan spectrum/i, // the Cowan Spectrum is the Dome's basketball floor
    },
    'ICCU Arena': {
      geo: [46.7275, -117.01824],
      area: 'town',
      capacity: 4200,
      type: 'sports',
      cssVar: '--v-iccu',
      color: '#ea86bc',
      url: 'https://govandals.com/facilities/iccu-arena/10',
      icon: 'https://www.google.com/s2/favicons?domain=govandals.com&sz=128',
      tm: { id: 'Z7r9jZa7-4', match: 'iccu arena', fallbackUrl: 'https://govandals.com/facilities/iccu-arena/10' },
      alias: /iccu arena|idaho central credit union arena/i,
    },
    'Kenworthy Performing Arts Centre': {
      geo: [46.73073, -117.00097],
      area: 'town',
      capacity: 400,
      type: 'arts',
      cssVar: '--v-kenworthy',
      color: '#9fea86',
      url: 'https://kenworthy.org/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=kenworthy.org&sz=128',
      tm: { id: 'Z7r9jZadbK', match: 'kenworthy', fallbackUrl: 'https://kenworthy.org/calendar' },
      alias: /kenworthy/i,
    },
    'Clearwater River Casino': {
      geo: [46.4363, -116.9084],
      area: 'town',
      capacity: 1500,
      type: 'concert',
      cssVar: '--v-crcasino',
      color: '#8a86ea',
      url: 'https://crcasino.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=crcasino.com&sz=128',
      tm: { id: 'Z7r9jZaeDd', match: 'clearwater river', fallbackUrl: 'https://crcasino.com/events/' },
      alias: /clearwater river casino/i,
    },
    'Liberty Theatre': {
      geo: [46.4206, -117.0238],
      area: 'town',
      capacity: 700,
      type: 'arts',
      cssVar: '--v-liberty',
      color: '#eaa786',
      url: 'https://www.ticketmaster.com/search?q=Liberty+Theatre+Lewiston', // the Lewiston house keeps no events page of its own
      icon: 'https://www.google.com/s2/favicons?domain=www.ticketmaster.com&sz=128',
      tm: { id: 'ZFr9jZ6aa7', match: 'liberty theatre', fallbackUrl: 'https://www.ticketmaster.com/search?q=Liberty+Theatre+Lewiston' },
      alias: /liberty theat/i,
    },
  };

  // The usual view: every room on — nothing here lists nightly bar programs
  var DEFAULT_ON = ['Martin Stadium', 'Beasley Coliseum', 'Bohler Gymnasium', 'CUB Senior Ballroom', 'Kibbie Dome', 'ICCU Arena', 'Kenworthy Performing Arts Centre', 'Clearwater River Casino', 'Liberty Theatre'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // Event types: every event lands in exactly one, from its flags, title,
  // then venue. The rows the panel shows, in order.
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — Beasley headliners to the casino stage' },
    { key: 'sports', label: 'Sports', title: 'Cougars and Vandals home games, volleyball at Bohler' },
    { key: 'arts', label: 'Arts & Theater', title: 'The Kenworthy, the Liberty, comedy, dance' },
    { key: 'community', label: 'Community', title: 'Campus days, fairs, family shows' },
  ];
  var MOVIE_VENUE = null; // the Kenworthy screens films, but its listing here is the live calendar

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 24 slots from the first build: five base-36 digits.
  var CODE_LENGTH = 5;
  var REGISTRY = [
    ['venue', 'Martin Stadium'], ['venue', 'Beasley Coliseum'], ['venue', 'Bohler Gymnasium'], ['venue', 'CUB Senior Ballroom'], ['venue', 'Kibbie Dome'], ['venue', 'ICCU Arena'], ['venue', 'Kenworthy Performing Arts Centre'], ['venue', 'Clearwater River Casino'], ['venue', 'Liberty Theatre'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'cougars'], ['team', 'cougarshoops'], ['team', 'vandals'], ['team', 'vandalshoops'], ['team', 'seahawks'], ['team', 'mariners'], ['team', 'kraken'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  // The words the page uses for the place
  var WORDS = {
    teamCity: 'Seattle', // the board drops it from the clubs' names ("Seattle Kraken" → Kraken); the college clubs carry their own
    presetDefault: 'Every venue — Martin Stadium, Beasley, the Kibbie Dome, the Kenworthy and the Lewiston stages — every team and type',
    presetNeighborhood: 'Pullman and the campus only',
    presetBig: 'Only the places that hold 2,000 or more — Martin Stadium, Beasley Coliseum, Bohler, the Kibbie Dome and ICCU Arena',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing Pullman and the campus only.', big: 'Showing the big venues only — the stadiums, the arenas and Bohler.' },
  };

  global.LQACity = {
    key: 'pullman',
    name: 'Pullman',
    site: 'https://pullman.here.events/',
    userAgent: 'Mozilla/5.0 (compatible; pullman-events/1.0; +https://pullman.here.events/)',
    tz: 'America/Los_Angeles', tzName: 'Pacific', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: "Washington", stateOutline: 'M6.9 5.6L9.4 5.6L12.6 5.6L15.9 5.6L19.2 5.6L21.6 5.6L21.6 7.4L21.6 9.2L21.7 11.0L21.7 12.8L21.7 14.7L21.6 15.4L21.9 16.3L22.0 16.9L20.0 16.9L18.0 16.9L16.6 16.9L15.5 17.1L13.2 17.9L11.0 18.2L9.8 18.0L8.6 18.4L7.5 18.3L7.0 17.8L6.3 16.3L5.7 16.3L5.2 15.9L4.1 15.9L3.7 15.5L3.8 14.9L4.1 14.4L3.5 13.6L3.7 13.0L3.5 13.3L3.3 12.3L2.6 10.1L2.0 8.7L2.2 7.9L3.6 8.6L5.7 8.9L6.3 9.0L6.7 9.0L7.0 9.0L7.3 9.8L6.9 10.1L6.0 11.4L6.1 11.8L6.6 11.5L6.2 11.4L6.6 10.8L7.1 10.2L7.4 9.6L7.6 10.0L7.3 10.5L7.2 10.8L7.5 11.4L7.4 12.1L7.1 12.0L6.9 11.9L6.5 12.2L6.6 12.6L7.1 12.7L7.5 12.1L7.9 11.9L8.0 11.1L7.9 10.6L8.0 10.3L8.1 9.7L8.3 9.2L7.9 8.7L7.9 9.0L7.6 8.7L7.7 8.3L7.7 7.9L7.3 7.7L7.3 7.5L7.7 7.4L7.6 6.8L7.5 6.4L7.2 6.3Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    // the calendar feed's header; the UID domain never changes (changing it
    // re-creates every event in subscribers' calendars)
    ics: { name: 'Pullman Events', short: 'Pullman Events', teams: 'Pullman home teams — every season', prodid: '-//here.events//pullman-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Pullman\\, WA — Martin Stadium\\, Beasley Coliseum\\, the Kibbie Dome\\, the Kenworthy and the Lewiston stages' },
    teams: TEAMS,
    map: { // the Map view (local-map.js; the ground drawn once by scripts/build-local-map.mjs from OpenStreetMap, committed as site/local-map.json) — Steve, 2026-10-25
      kind: 'urban',
      bbox: [46.35, -117.45, 46.95, -116.75], // south, west, north, east — the Palouse — Pullman and Moscow at the centre, Lewiston and Clarkston at the foot, Colfax at the top
      home: [46.72, -117.19, 46.745, -117.14], // the view at first; the fit button shows the whole frame
      roads: ['motorway', 'trunk', 'primary'],
      tolerance: 0.8,
      labels: [
        { name: 'Pullman', lat: 46.7296, lon: -117.1799, anchor: 'end' },
        { name: 'Moscow', lat: 46.7324, lon: -117.0002, anchor: 'start' },
        { name: 'Lewiston', lat: 46.4196, lon: -117.0216, anchor: 'start' },
        { name: 'Clarkston', lat: 46.4163, lon: -117.0452, anchor: 'end' },
        { name: 'Colfax', lat: 46.8802, lon: -117.3643, anchor: 'end' },
        { name: 'Snake River', lat: 46.43, lon: -117.12, kind: 'water', anchor: 'middle' },
      ],
    },
    venues: VENUES,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: null, // every listing is read by room, so nothing arrives under a name city.js lacks
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
