# SmartHire — Option 2 Update

Implemented from the existing SmartHire project baseline without rebuilding the application.

## Added

- Candidate profile photo upload (JPG/PNG/WEBP, 2 MB limit)
- Candidate verified skill score display
- Persistent learning roadmap generated from active-job skill gaps
- Learning progress persistence
- Learning resources per skill
- Six backend-scored assessments:
  - JavaScript
  - React
  - Node.js
  - Java
  - Python
  - SQL
- Assessment attempts stored in MongoDB
- Answer keys kept server-side
- 80% pass threshold
- Passed assessment creates/updates a VerifiedSkill record
- Assessment result notification
- Candidate assessment history
- Candidate roadmap and assessment navigation
- Assessment auto-seeding on server startup when missing
- Full seed integration for assessments

## Main flow

Profile → Skill Gap → Learning Roadmap → Assessment → Backend Score → Verified Skill → Updated Roadmap

## Validation performed

- Backend JavaScript syntax checks passed.
- Backend app module loaded successfully.
- Assessment grading logic tested with an 80% passing case.
- All client JS/JSX source files parsed successfully with Babel parser.
- Vite production build could not be completed in this Linux container because the supplied `node_modules` is missing Rollup's platform-specific optional package. This is an environment/dependency-install issue, not a source parser error.

## Run locally

From the project root:

```bash
cd server
npm install
npm run dev
```

In another terminal:

```bash
cd client
npm install
npm run dev
```

MongoDB must be running and `server/.env` must contain the appropriate connection settings.
