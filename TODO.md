# TODO: Herbal Authenticity Dashboard - Raspberry Pi Integration

## System Overview
Data pipeline: Raspberry Pi Sensor Hub → FastAPI Backend → Next.js Dashboard

Raspberry Pi reads sensors (pH, Conductivity, ORP, Turbidity, Temperature, Moisture, Ion-selective, RF Resonator, Voltammetry), packages into JSON, sends via POST to FastAPI /api/classify. FastAPI runs AI classification and responds with herb name, purity %, adulteration flag, confidence. Next.js frontend displays results in radar + voltammetry charts.

## Completed Steps
- [x] Manually delete node_modules folder and pnpm-lock.yaml (due to access denied errors)
- [x] Run npm install to reinstall dependencies (switched from pnpm due to network issues)
- [x] Stop the current npx next dev and run npm run dev after install completes
- [x] Analyze any terminal or code errors shown during dev server startup
- [x] Fix any identified errors in code or configuration
- [x] Verify the application runs without errors
- [x] Create FastAPI backend with /api/classify, /api/upload, /api/history endpoints
- [x] Install FastAPI and Uvicorn
- [x] Test FastAPI endpoints with mock data
- [x] Confirm Next.js login API working

## Pending Tasks
- [ ] Thoroughly test frontend UI (login, dashboard pages, components)
- [ ] Verify sensor data integration (Raspberry Pi JSON → FastAPI → frontend charts)
- [ ] Update documentation to reflect Raspberry Pi as sensor hub
- [ ] Ensure no ESP32 references remain (confirmed none found)
