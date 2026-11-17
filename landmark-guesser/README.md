# Landmark Guesser

A GeoGuessr-style game in plain HTML, CSS and JavaScript. No build step, no libraries, no server needed.

## Run it
Double-click `index.html` (or drag it into your browser). To put it on a website, upload the whole folder.

## How it plays
1. A photo of a landmark appears. Pick its name from 4 choices (a hint shows the country for half points).
2. Drop a pin on the world map where you think it is.
3. The map zooms to the real spot and shows the distance, the place, the year and a fact.

Scoring: up to 500 points for the name, up to 500 for the pin (500 x e^(-distance/1500 km)).

## Add your photos
Save one photo per landmark in the `images/` folder using these exact names (landscape photos around 1200x800 work best).
Until a file exists, the game shows a placeholder drawing for that landmark.

| # | Landmark | File |
|---|----------|------|
| 1 | Eiffel Tower | `images/eiffel-tower.jpg` |
| 2 | Great Pyramid of Giza | `images/great-pyramid-of-giza.jpg` |
| 3 | Statue of Liberty | `images/statue-of-liberty.jpg` |
| 4 | Taj Mahal | `images/taj-mahal.jpg` |
| 5 | Colosseum | `images/colosseum.jpg` |
| 6 | Big Ben | `images/big-ben.jpg` |
| 7 | Great Wall of China | `images/great-wall-of-china.jpg` |
| 8 | Machu Picchu | `images/machu-picchu.jpg` |
| 9 | Christ the Redeemer | `images/christ-the-redeemer.jpg` |
| 10 | Petra | `images/petra.jpg` |
| 11 | Golden Gate Bridge | `images/golden-gate-bridge.jpg` |
| 12 | Leaning Tower of Pisa | `images/leaning-tower-of-pisa.jpg` |
| 13 | Stonehenge | `images/stonehenge.jpg` |
| 14 | Easter Island (Moai) | `images/easter-island.jpg` |
| 15 | Mount Fuji | `images/mount-fuji.jpg` |
| 16 | Grand Canyon | `images/grand-canyon.jpg` |
| 17 | Uyuni Salt Flats | `images/uyuni-salt-flats.jpg` |
| 18 | Niagara Falls | `images/niagara-falls.jpg` |
| 19 | Mount Everest | `images/mount-everest.jpg` |
| 20 | Berlin Wall | `images/berlin-wall.jpg` |
| 21 | One World Trade Center | `images/one-world-trade-center.jpg` |
| 22 | Hollywood Sign | `images/hollywood-sign.jpg` |
| 23 | Nile River | `images/nile-river.jpg` |
| 24 | Cologne Cathedral | `images/cologne-cathedral.jpg` |
| 25 | Acropolis of Athens | `images/acropolis-of-athens.jpg` |
| 26 | Mount Rushmore | `images/mount-rushmore.jpg` |
| 27 | Panama Canal | `images/panama-canal.jpg` |
| 28 | Times Square | `images/times-square.jpg` |
| 29 | Brooklyn College | `images/brooklyn-college.jpg` |
| 30 | Empire State Building | `images/empire-state-building.jpg` |

The game also accepts `.jpeg`, `.png` and `.webp` with the same base name.
Put the photo credit in the `credit` field (shown after each answer). Check the licence of each photo you use.

## Files
- `index.html`, `style.css`: page and look
- `game.js`: all game logic (rounds, scoring, map pan/zoom, pins)
- `landmarks.js`: the 30 landmarks and their facts, so edit or swap them here
- `art.js`: placeholder drawings for some landmarks (safe to delete once all photos are in; the game still works)
- `world-map.js`: world map outline data
