export const CONCEPT_MAP = {
    // ------------------------------------
    // TV SERIES
    // ------------------------------------
    "dark": {
        id: 70523,
        type: "tv",
        genres: [9648, 10765, 18], // Mystery, Sci-Fi, Drama
        keywords: "time travel|paradox|parallel world|mystery|mind-bending",
        desc: "mind-bending sci-fi mysteries involving time travel and parallel worlds"
    },
    "stranger things": {
        id: 66732,
        type: "tv",
        genres: [10765, 9648, 18],
        keywords: "supernatural|monster|80s|mystery",
        desc: "supernatural mysteries with retro vibes and monsters"
    },
    "breaking bad": {
        id: 1396,
        type: "tv",
        genres: [80, 18], // Crime, Drama
        keywords: "drug lord|crime|anti hero|cartel",
        desc: "intense crime dramas featuring complex anti-heroes"
    },
    "game of thrones": {
        id: 1399,
        type: "tv",
        genres: [10765, 18, 10759],
        keywords: "kingdom|politics|dragon|war",
        desc: "epic fantasy sagas with political intrigue and war"
    },
    "black mirror": {
        id: 42009,
        type: "tv",
        genres: [10765, 18, 9648],
        keywords: "dystopia|technology|future|satire",
        desc: "thought-provoking dystopian stories about technology"
    },
    "the boys": {
        id: 76479,
        type: "tv",
        genres: [10765, 10759],
        keywords: "superhero|satire|dark comedy|violent",
        desc: "gritty, satirical takes on the superhero genre"
    },

    // ------------------------------------
    // MOVIES
    // ------------------------------------
    "inception": {
        id: 27205,
        type: "movie",
        genres: [28, 878, 12], // Action, Sci-Fi, Adventure
        keywords: "dream|heist|mind-bending|reality",
        desc: "complex sci-fi blockbusters dealing with reality and dreams"
    },
    "interstellar": {
        id: 157336,
        type: "movie",
        genres: [12, 18, 878], // Adventure, Drama, Sci-Fi
        keywords: "space|black hole|time dilation|father daughter",
        desc: "epic space exploration movies with emotional cores"
    },
    "parasite": {
        id: 496243,
        type: "movie",
        genres: [35, 53, 18], // Comedy, Thriller, Drama
        keywords: "class struggle|social commentary|twist",
        desc: "sharp social thrillers with dark humor and twists"
    },
    "joker": {
        id: 475557,
        type: "movie",
        genres: [80, 53, 18],
        keywords: "psychological|clown|descent|mental health",
        desc: "dark psychological character studies"
    },
    "avengers": {
        id: 299534, // Endgame
        type: "movie",
        genres: [28, 12, 878],
        keywords: "superhero|team|comic book|alien invasion",
        desc: "massive superhero team-up events"
    },
    "bahubali": {
        id: 256040,
        type: "movie",
        genres: [28, 12, 18],
        keywords: "epic|war|kingdom|mythology",
        desc: "grand epic action movies with war and mythology"
    }
};

export const normalizeTitle = (title) => {
    return title.toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
};
