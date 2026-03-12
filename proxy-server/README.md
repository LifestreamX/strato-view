# StratoView OpenSky Proxy

Simple proxy server to fetch OpenSky OAuth2 tokens and aircraft state data on behalf of clients that cannot reach OpenSky directly (for example, Vercel deployments blocked by OpenSky).

Usage

1. Copy `.env.example` to `.env` and fill in `OPENSKY_CLIENT_ID` and `OPENSKY_CLIENT_SECRET`.
2. Install dependencies and start the server:

```bash
cd proxy-server
npm install
npm start
```

3. Endpoints:
- `POST /opensky-token` — returns the OAuth2 token from OpenSky using server-side credentials.
- `GET /opensky-states?access_token=TOKEN` — proxies `https://opensky-network.org/api/states/all` and returns the result.

Deploy this server to a VPS or provider that OpenSky does not block. Then set `OPENSKY_PROXY_URL` in your Vercel project to the proxy base URL (e.g. `https://proxy.example.com`).
