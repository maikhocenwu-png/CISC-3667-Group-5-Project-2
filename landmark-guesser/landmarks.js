// ============================================================
// YOUR LANDMARKS. Edit freely: change names, facts, or swap landmarks.
// Each landmark needs a photo in the images/ folder named <id>.jpg
// (.jpeg .png .webp also work: the game tries each one).
// "credit" is optional text shown with the answer, e.g. "Photo: Name / Wikimedia Commons (CC BY-SA 4.0)".
// ============================================================
const LANDMARKS = [
  {
    id: 'eiffel-tower',
    name: "Eiffel Tower",
    country: "France",
    place: "Paris",
    lat: 48.8584, lon: 2.2945,
    year: "1889",
    fact: "Built for the 1889 World's Fair, it was the tallest structure in the world until 1930. It is repainted roughly every seven years.",
    credit: ''
  },
  {
    id: 'great-pyramid-of-giza',
    name: "Great Pyramid of Giza",
    country: "Egypt",
    place: "Giza, near Cairo",
    lat: 29.9792, lon: 31.1342,
    year: "c. 2560 BC",
    fact: "Built as a tomb for pharaoh Khufu, it was the tallest human-made structure on Earth for around 3,800 years.",
    credit: ''
  },
  {
    id: 'statue-of-liberty',
    name: "Statue of Liberty",
    country: "United States",
    place: "Liberty Island, New York",
    lat: 40.6892, lon: -74.0445,
    year: "1886",
    fact: "A gift from France, designed by Frédéric Auguste Bartholdi. Her copper skin turned green through natural oxidation.",
    credit: ''
  },
  {
    id: 'taj-mahal',
    name: "Taj Mahal",
    country: "India",
    place: "Agra",
    lat: 27.1751, lon: 78.0421,
    year: "1653",
    fact: "Commissioned by emperor Shah Jahan as a mausoleum for his wife Mumtaz Mahal. It is made of white marble.",
    credit: ''
  },
  {
    id: 'colosseum',
    name: "Colosseum",
    country: "Italy",
    place: "Rome",
    lat: 41.8902, lon: 12.4922,
    year: "AD 80",
    fact: "The largest amphitheatre ever built, it could hold an estimated 50,000 spectators for gladiator games.",
    credit: ''
  },
  {
    id: 'big-ben',
    name: "Big Ben",
    country: "United Kingdom",
    place: "London",
    lat: 51.5007, lon: -0.1246,
    year: "1859",
    fact: "\"Big Ben\" is really the name of the great bell. The tower was renamed Elizabeth Tower in 2012.",
    credit: ''
  },
  {
    id: 'great-wall-of-china',
    name: "Great Wall of China",
    country: "China",
    place: "Badaling, near Beijing",
    lat: 40.3599, lon: 116.0204,
    year: "Ming era (1500s rebuild)",
    fact: "The wall is not one structure but many linked sections built over centuries. The Badaling section was rebuilt under the Ming dynasty.",
    credit: ''
  },
  {
    id: 'machu-picchu',
    name: "Machu Picchu",
    country: "Peru",
    place: "near Cusco",
    lat: -13.1631, lon: -72.545,
    year: "c. 1450",
    fact: "A 15th-century Inca citadel high in the Andes at about 2,400 m. It was brought to world attention in 1911.",
    credit: ''
  },
  {
    id: 'christ-the-redeemer',
    name: "Christ the Redeemer",
    country: "Brazil",
    place: "Rio de Janeiro",
    lat: -22.9519, lon: -43.2105,
    year: "1931",
    fact: "The Art Deco statue stands about 30 m tall on Corcovado mountain, and was named one of the New Seven Wonders in 2007.",
    credit: ''
  },
  {
    id: 'petra',
    name: "Petra",
    country: "Jordan",
    place: "Petra",
    lat: 30.3285, lon: 35.4444,
    year: "c. 1st century",
    fact: "Al-Khazneh was carved straight into rose-red sandstone cliffs by the Nabataeans, who ran caravan trade routes here.",
    credit: ''
  },
  {
    id: 'golden-gate-bridge',
    name: "Golden Gate Bridge",
    country: "United States",
    place: "San Francisco",
    lat: 37.8199, lon: -122.4783,
    year: "1937",
    fact: "When it opened, it had the longest main suspension span in the world. Its colour is called International Orange.",
    credit: ''
  },
  {
    id: 'leaning-tower-of-pisa',
    name: "Leaning Tower of Pisa",
    country: "Italy",
    place: "Pisa",
    lat: 43.723, lon: 10.3966,
    year: "1173 (construction began)",
    fact: "The bell tower began to tilt during construction because it was built on soft ground. Restoration work reduced the lean.",
    credit: ''
  },
  {
    id: 'stonehenge',
    name: "Stonehenge",
    country: "United Kingdom",
    place: "Wiltshire, England",
    lat: 51.1789, lon: -1.8262,
    year: "c. 2500 BC",
    fact: "This prehistoric ring of standing stones was raised in stages. Some of the smaller bluestones came from Wales.",
    credit: ''
  },
  {
    id: 'easter-island',
    name: "Easter Island (Moai)",
    country: "Chile",
    place: "Rapa Nui (Easter Island)",
    lat: -27.1258, lon: -109.2784,
    year: "c. 1250–1500",
    fact: "The monumental statues were carved by the Rapa Nui people. There are almost 900 of them across the island.",
    credit: ''
  },
  {
    id: 'mount-fuji',
    name: "Mount Fuji",
    country: "Japan",
    place: "Honshu",
    lat: 35.3606, lon: 138.7274,
    year: "Last erupted 1707",
    fact: "Japan's highest mountain stands 3,776 m tall. It is an active volcano, though its last eruption was in 1707.",
    credit: ''
  },
  {
    id: 'grand-canyon',
    name: "Grand Canyon",
    country: "United States",
    place: "Arizona",
    lat: 36.1069, lon: -112.1129,
    year: "Carved over millions of years",
    fact: "The Colorado River carved this canyon over millions of years. It runs about 446 km long and more than 1.8 km deep.",
    credit: ''
  },
  {
    id: 'uyuni-salt-flats',
    name: "Uyuni Salt Flats",
    country: "Bolivia",
    place: "Potosí Department",
    lat: -20.1338, lon: -67.4891,
    year: "Natural wonder",
    fact: "The world's largest salt flat covers about 10,000 km². A thin film of rainwater turns it into a giant mirror.",
    credit: ''
  },
  {
    id: 'niagara-falls',
    name: "Niagara Falls",
    country: "Canada / United States",
    place: "Ontario and New York",
    lat: 43.0962, lon: -79.0377,
    year: "Natural wonder",
    fact: "Three waterfalls sit on the Canada–US border. The Niagara River drops about 50 m over them.",
    credit: ''
  },
  {
    id: 'mount-everest',
    name: "Mount Everest",
    country: "Nepal / China",
    place: "Himalayas",
    lat: 27.9881, lon: 86.925,
    year: "First summited 1953",
    fact: "At 8,849 m it is the highest mountain above sea level. Edmund Hillary and Tenzing Norgay made the first confirmed ascent in 1953.",
    credit: ''
  },
  {
    id: 'berlin-wall',
    name: "Berlin Wall",
    country: "Germany",
    place: "East Side Gallery, Berlin",
    lat: 52.5051, lon: 13.4396,
    year: "1961–1989",
    fact: "The wall divided Berlin from 1961 until it fell on 9 November 1989. The East Side Gallery keeps a long stretch covered in murals.",
    credit: ''
  },
  {
    id: 'one-world-trade-center',
    name: "One World Trade Center",
    country: "United States",
    place: "Lower Manhattan, New York City",
    lat: 40.7127, lon: -74.0134,
    year: "2014",
    fact: "It is 1,776 ft (541 m) tall, a nod to the year 1776. It is the tallest building in the United States.",
    credit: ''
  },
  {
    id: 'hollywood-sign',
    name: "Hollywood Sign",
    country: "United States",
    place: "Mount Lee, Los Angeles",
    lat: 34.1341, lon: -118.3215,
    year: "1923",
    fact: "It first read \"Hollywoodland\" and was an ad for a housing development. The last four letters were removed in 1949.",
    credit: ''
  },
  {
    id: 'nile-river',
    name: "Nile River",
    country: "Egypt (and 10 other countries)",
    place: "Pin marks the Nile near Luxor",
    lat: 25.6989, lon: 32.6421,
    year: "Ancient",
    fact: "The Nile flows roughly 6,650 km north to the Mediterranean through 11 countries. Ancient Egyptian civilisation grew along its banks.",
    credit: ''
  },
  {
    id: 'cologne-cathedral',
    name: "Cologne Cathedral",
    country: "Germany",
    place: "Cologne",
    lat: 50.9413, lon: 6.9583,
    year: "1248–1880",
    fact: "Building began in 1248 and was only finished in 1880. Its two spires rise about 157 m.",
    credit: ''
  },
  {
    id: 'acropolis-of-athens',
    name: "Acropolis of Athens",
    country: "Greece",
    place: "Athens",
    lat: 37.9715, lon: 23.7257,
    year: "5th century BC",
    fact: "The hilltop citadel is crowned by the Parthenon, a temple to Athena built in the 5th century BC.",
    credit: ''
  },
  {
    id: 'mount-rushmore',
    name: "Mount Rushmore",
    country: "United States",
    place: "Black Hills, South Dakota",
    lat: 43.8791, lon: -103.4591,
    year: "1927–1941",
    fact: "Sculptor Gutzon Borglum led the carving of four presidents: Washington, Jefferson, Theodore Roosevelt and Lincoln. The Black Hills are also sacred to the Lakota.",
    credit: ''
  },
  {
    id: 'panama-canal',
    name: "Panama Canal",
    country: "Panama",
    place: "Miraflores Locks",
    lat: 8.9967, lon: -79.5894,
    year: "1914",
    fact: "The 82 km canal links the Atlantic and Pacific. Locks lift ships about 26 m up to Gatún Lake.",
    credit: ''
  },
  {
    id: 'times-square',
    name: "Times Square",
    country: "United States",
    place: "Midtown Manhattan, New York City",
    lat: 40.758, lon: -73.9855,
    year: "Named 1904",
    fact: "It was renamed from Longacre Square after The New York Times moved there in 1904. The New Year's Eve ball drop began in 1907.",
    credit: ''
  },
  {
    id: 'brooklyn-college',
    name: "Brooklyn College",
    country: "United States",
    place: "Midwood, Brooklyn, New York City",
    lat: 40.6314, lon: -73.9541,
    year: "Founded 1930",
    fact: "Part of the City University of New York (CUNY), it was founded in 1930. Its Georgian-style buildings surround a central quad.",
    credit: ''
  },
  {
    id: 'empire-state-building',
    name: "Empire State Building",
    country: "United States",
    place: "Midtown Manhattan, New York City",
    lat: 40.7484, lon: -73.9857,
    year: "1931",
    fact: "It was finished in 1931 after roughly a year of construction. It stands about 443 m tall with its antenna and was the world's tallest building until 1970.",
    credit: ''
  }
];
