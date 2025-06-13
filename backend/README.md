# StorySentinel Backend

This backend server provides API endpoints for the StorySentinel frontend to interact with external services like Yakoa IP protection API and Story Protocol.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
PORT=3001
YAKOA_API_KEY=your_yakoa_api_key
YAKOA_BASE_URL=https://docs-demo.ip-api-sandbox.yakoa.io/docs-demo
STORY_API_KEY=your_story_api_key
FRONTEND_URL=http://localhost:5173
```

3. Run in development mode:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Yakoa API

- `POST /api/yakoa/register` - Register token with Yakoa
- `GET /api/yakoa/token/:tokenId` - Get token details
- `POST /api/yakoa/create-registration-data` - Create registration data
- `POST /api/yakoa/generate-identifier` - Generate token identifier
- `GET /api/yakoa/health` - Yakoa service health

### Story Protocol API

- `GET /api/story/health` - Story Protocol service health
- `GET /api/story/disputes` - Disputes endpoint (placeholder)

## Architecture

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests
- **dotenv** - Environment configuration
- **node-fetch** - HTTP requests to external APIs

The backend acts as a proxy to handle CORS issues and provide a secure interface to external APIs.
