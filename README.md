# ✈️ STRATOVIEW

Real-time global aircraft tracking and visualization platform built with Next.js, TypeScript, and Leaflet.

![StratoView](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

- **Real-Time Aircraft Tracking**: Visualize thousands of aircraft worldwide in real-time
- **Interactive Map**: Powered by Leaflet.js with OpenStreetMap tiles
- **Advanced Filtering**: Filter aircraft by altitude, speed, country, callsign, and ICAO24
- **Planes Above Me**: Find aircraft near your location with configurable radius
- **Aircraft Clustering**: Performance-optimized marker clustering for thousands of aircraft
- **User Accounts**: Save favorite aircraft and preferences with Google OAuth
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Production Ready**: Includes comprehensive testing, error handling, and logging

## 🚀 Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Leaflet.js** for interactive maps
- **OpenStreetMap** tiles

### Backend

- **Next.js API Routes**
- **Node.js**
- **Server-side caching** (in-memory)

### Database

- **CockroachDB** (PostgreSQL compatible)
- **Prisma ORM**

### Authentication

- **NextAuth.js** with Google OAuth

### Testing

- **Jest** for unit tests
- **Playwright** for end-to-end tests

### Code Quality

- **ESLint**
- **Prettier**
- **TypeScript** strict mode

## 📋 Prerequisites

- Node.js 18+ and npm
- CockroachDB database (provided connection string)
- Google OAuth credentials (provided)

## 🛠️ Installation

1. **Clone the repository** (or navigate to the project directory):

   ```bash
   cd "c:\Users\tyler\OneDrive\Desktop\StratoView"
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment variables are already configured** in `.env.local`:
   - `DATABASE_URL`: CockroachDB connection string
   - `NEXTAUTH_URL`: Application URL
   - `NEXTAUTH_SECRET`: NextAuth secret key
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

4. **Set up the database**:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Run Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# All tests
npm run test:all
```

### Lint and Format

```bash
npm run lint
npm run format
```

### Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Open Prisma Studio
npm run prisma:studio
```

## 📁 Project Structure

```
/app
  /api
    /auth          # NextAuth authentication routes
    /aircraft      # Aircraft data endpoints
    /user          # User data endpoints
  /auth            # Authentication pages
  /map             # Live map page
  /dashboard       # User dashboard
  layout.tsx       # Root layout
  page.tsx         # Homepage
  globals.css      # Global styles

/components
  /map             # Map components
  /filters         # Filter components
  /ui              # UI components
  /providers       # Context providers

/lib
  /api             # API services
  /auth            # Authentication utilities
  /cache           # Caching layer
  /db              # Database utilities
  /utils           # Helper functions

/prisma
  schema.prisma    # Database schema

/types             # TypeScript type definitions

/hooks             # React custom hooks

/tests
  /unit            # Unit tests
  /e2e             # End-to-end tests

/public            # Static assets
```

## 🔑 Key Features Explained

### Real-Time Data Fetching

The application fetches aircraft data from the OpenSky Network API every 10 seconds:

- Automatic retry with exponential backoff (3 retries)
- Server-side caching (10-second TTL)
- Fallback to cached data on API failure
- Data normalization and validation

### Aircraft Filtering

Filter aircraft by multiple criteria:

- Altitude range (meters)
- Speed range (m/s)
- Origin country
- Aircraft ICAO24 identifier
- Flight callsign

### Planes Above Me

Uses browser geolocation to find nearby aircraft:

- Configurable search radius (10, 25, or 50 miles)
- Distance calculation using Haversine formula
- Sorted by proximity

### Map Performance

Optimized for thousands of aircraft:

- Marker clustering with `leaflet.markercluster`
- Dynamic marker updates without re-rendering
- Efficient position tracking
- Rotation based on aircraft heading

### User Authentication

Google OAuth integration with NextAuth.js:

- Secure session management
- Database-backed sessions
- User preferences and saved aircraft
- Protected API routes

## 🗄️ Database Schema

### User

- Authentication and profile information
- Links to saved aircraft, locations, and preferences

### SavedAircraft

- User's favorite aircraft
- Associated notes and metadata

### SavedLocation

- Saved geographic locations
- Configurable search radius

### UserPreferences

- Map display settings
- Default filters
- Notification preferences

## 🔒 Security

- Environment variables for sensitive data
- Secure authentication with NextAuth.js
- Protected API routes with session validation
- Input validation and sanitization
- HTTPS in production (required for geolocation)

## 📊 API Endpoints

### Aircraft Data

- `GET /api/aircraft` - Fetch all aircraft
- `POST /api/aircraft/filter` - Filter aircraft
- `POST /api/aircraft/nearby` - Find nearby aircraft

### User Data

- `GET /api/user/saved-aircraft` - Get saved aircraft
- `POST /api/user/saved-aircraft` - Save aircraft
- `DELETE /api/user/saved-aircraft/[id]` - Delete saved aircraft
- `GET /api/user/preferences` - Get preferences
- `PUT /api/user/preferences` - Update preferences

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth routes

## 🧪 Testing

The application includes comprehensive test coverage:

### Unit Tests

- Geo utility functions
- Cache management
- Logger functionality
- Data normalization

### Integration Tests

- API route handlers
- Database operations
- Authentication flows

### End-to-End Tests

- User navigation flows
- Map interactions
- Filter functionality
- Responsive design
- API integration

## 🐛 Error Handling

Robust error handling throughout:

- API request failures with retry logic
- Empty data responses
- Network errors
- Geolocation errors
- Authentication errors
- User-friendly error messages

## 📝 Logging

Centralized logging system:

- API requests and responses
- Error tracking
- Authentication events
- Development/production modes

## 🎨 UI/UX Design

- Clean aviation-themed interface
- Dark mode optimized
- Responsive design (mobile, tablet, desktop)
- Floating controls for map page
- Real-time updates
- Loading states and error feedback

## 🚀 Deployment

### Environment Setup

1. Set environment variables in production
2. Configure database connection
3. Set up Google OAuth redirect URLs
4. Enable HTTPS (required for geolocation)

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

## 🔧 Configuration

### Map Settings

- Default center: United States (39.8283, -98.5795)
- Default zoom: 4
- Tile provider: OpenStreetMap
- Marker clustering: Enabled

### Data Fetching

- Update interval: 10 seconds
- Cache TTL: 10 seconds
- Retry attempts: 3
- Retry delay: Exponential backoff

### API

- OpenSky Network: https://opensky-network.org/api/states/all
- Rate limiting: Handled by caching
- Timeout: 15 seconds

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [OpenSky Network API](https://openskynetwork.github.io/opensky-api/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Authors

Built as a production-ready aviation visualization platform.

## 🙏 Acknowledgments

- OpenSky Network for providing free aircraft data
- OpenStreetMap for map tiles
- All open-source contributors

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ✈️ by aviation enthusiasts**
