# 5indshow - Movie Discovery React App

A full-featured React + Tailwind CSS movie discovery application with genre selection, watchlist management, and user profile features.

## Quick Start

### Prerequisites
- Node.js 14+ and npm
- TMDB API key (optional - app uses mock data as fallback)

### Installation

1. Navigate to the project:
```bash
cd v:\cine-find\cine-app
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Add TMDB API key:
   - Copy `.env.example` to `.env.local`
   - Get an API key from [TMDB](https://www.themoviedb.org/settings/api)
   - Add it to `.env.local`:
   ```
   REACT_APP_TMDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`.

## Features

### Authentication
- Login & Signup with localStorage-based persistence
- Protected routes - redirects unauthenticated users to login
- Session persistence - user remains logged in after page reload

### Genre Management
- Genre Selection during onboarding
- Manage Genres - update preferences anytime
- Genre List - browse all available genres
- Persistent selection - genres saved to localStorage

### Home Screen
- Featured movie hero banner with watch now button
- Multiple movie sections - Trending, Popular, Top Rated, New Releases
- Horizontal scrolling movie carousels

### Movie Details
- Full movie information - banner, cast, providers, similar movies
- Bookmark functionality - save to watchlist
- Progress tracking

### Watchlist
- Currently Watching section with progress bars
- Saved for Later grid
- Add/remove movies from watchlist

### Profile
- User information - name, email, avatar
- Settings - notifications, dark theme toggle
- Logout functionality

## Context API Structure

### AuthContext
- user: { id, email, name, ... }
- isAuthenticated: boolean
- signIn, signUp, signOut functions

### GenreContext
- selectedGenres: number[]
- toggleGenre, setGenres functions

### WatchlistContext
- currentlyWatching, savedForLater arrays
- addToWatchlist, removeFromWatchlist, updateProgress functions

### UserContext
- user profile, darkTheme, notifications
- toggleDarkTheme, toggleNotifications functions

## Routing

- `/login` - Login page
- `/signup` - Sign up page
- `/genres` - Genre onboarding
- `/home` - Main home screen
- `/movie/:id` - Movie details
- `/manage-genres` - Update genres
- `/watchlist` - Watchlist
- `/profile` - User profile

## Data Persistence

All app state is persisted to localStorage:
- user - Authentication session
- selectedGenres - Selected genres list
- watchlist - Currently watching + saved for later
- darkTheme - Theme preference

## API Integration

If `REACT_APP_TMDB_API_KEY` is set, uses real TMDB data. Otherwise falls back to mock data from `src/data/mockMovies.js`.

## Technologies

- React 18+ - UI library
- React Router v6 - Client-side routing
- Tailwind CSS - Utility-first CSS
- React Icons - Icon library
- Context API - State management
- localStorage - Data persistence

## Available Scripts

```bash
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
