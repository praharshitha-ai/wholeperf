# WholePerf

A web app for cardiac perfusionists that puts pre-bypass calculations, the department's disposables stock and per-case procedure logs in one place. I trained as a perfusion technologist and built it around how a perfusion team works through a case.

**Live demo:** https://wholeperf.netlify.app (sign in with Google)

 ## What it does

- **Calculators:** body surface area (Mosteller), target blood flow (cardiac index × BSA), heparin dose, blood compatibility, cannula selection and ABG interpretation
- **Procedure logs:** one record per patient with pre-op, intra-op, post-op and discharged status, stored in Firestore under the clinician who created it
- **Inventory:** oxygenators, tubing kits, cannulae, filters and drugs, each with a minimum-stock threshold so low items get flagged
- **Console and records views:** a dual-panel perfusion console and an overview of past records
- **Sign-in:** Google accounts through Firebase Authentication

The device-connection panel is simulated. It lists mock pump hardware and doesn't talk to real devices.

## Security rules

[`firestore.rules`](firestore.rules) denies all reads and writes by default, then opens each collection on purpose:

- A patient record can only be read or edited by the clinician who created it, and it can't be deleted.
- Inventory items are readable by any signed-in user, and writes are validated, so stock can't go negative.
- Audit log entries are append-only.

[`security_spec.md`](security_spec.md) lists twelve attack payloads (identity spoofing, injected fields, oversized IDs, back-dated timestamps and others) along with the response the rules should give to each.

## Built with

React 19, TypeScript, Vite, Tailwind CSS, Firebase Authentication and Firestore, Recharts and Motion. The first version was scaffolded in Google AI Studio.

## Run it locally

You need Node.js and a Firebase project with Authentication (Google provider) and Firestore enabled.

```bash
npm install
cp firebase-applet-config.example.json firebase-applet-config.json
# fill firebase-applet-config.json with your Firebase web app config
npm run dev
```

The app runs at http://localhost:3000. `npm run lint` type-checks the project and `npm run build` creates the production bundle in `dist/`.

## Limitations

- This is a demo. It isn't a medical device, and none of the calculators are validated for clinical use. Check any result against your unit's protocols.
- Patient and staff names in the app are made-up sample data.
- Every signed-in user gets the perfusionist role. There's no role management yet.
