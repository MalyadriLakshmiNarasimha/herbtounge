# TODO: Upgrade LiveTest.tsx to Full 3-Step Wizard

## Current Task: Replace LiveTest.tsx with Upgraded Version
- [ ] Install required dependencies: `npm install papaparse react-plotly.js plotly.js react-gauge-chart framer-motion html2canvas jspdf`
- [ ] Replace existing `components/live-testing/LiveTest.tsx` with the full upgraded 3-step wizard version
- [ ] Verify the component renders correctly and all features work (demo samples, upload, analyze, results, PDF export)
- [ ] Test accessibility features (keyboard navigation, ARIA labels)
- [ ] Check TODO hooks in code for backend wiring

## Next Steps (User Requested)
- [ ] Create FastAPI `/api/classify` skeleton (Python) — request/response schemas matching the page
- [ ] Create JSON file of all 12 demo samples as a standalone file to import
- [ ] Split into smaller components (ExplainabilityCard.tsx, RadarChart.tsx) for modularity
- [ ] Create compact README with install commands and backend wiring guide
