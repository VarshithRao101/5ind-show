import {
    FaFire, FaMapMarkedAlt, FaMagic, FaLaughBeam, FaUserSecret,
    FaFilm, FaTheaterMasks, FaHome, FaDragon, FaLandmark,
    FaGhost, FaMusic, FaSearch, FaHeart, FaRocket,
    FaTv, FaRunning, FaFighterJet, FaHatCowboy
} from 'react-icons/fa';

// Premium Flat Icons Map (FontAwesome)
export const GENRE_ICONS = {
    "Action": FaFire,
    "Adventure": FaMapMarkedAlt,
    "Animation": FaMagic,
    "Comedy": FaLaughBeam,
    "Crime": FaUserSecret,
    "Documentary": FaFilm,
    "Drama": FaTheaterMasks,
    "Family": FaHome,
    "Fantasy": FaDragon,
    "History": FaLandmark,
    "Horror": FaGhost,
    "Music": FaMusic,
    "Mystery": FaSearch,
    "Romance": FaHeart,
    "Science Fiction": FaRocket,
    "TV Movie": FaTv,
    "Thriller": FaRunning,
    "War": FaFighterJet,
    "Western": FaHatCowboy,
    "default": FaFilm
};

export const getGenreIcon = (name) => {
    return GENRE_ICONS[name] || GENRE_ICONS['default'];
};
