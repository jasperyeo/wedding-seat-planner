# Gather | Wedding Seating Planner

A responsive seating planner built with Angular 22, PrimeNG 21, Tailwind CSS 4, and Lucide. Keep the guest list, RSVP status, meal choice, and reception table assignments together, then export the plan as CSV.

## Requirements

- Node.js 22.12 or newer
- npm 11 or newer

PrimeNG 21 currently declares Angular 21 as its peer range. This project intentionally pairs PrimeNG 21 with the requested Angular 22; `.npmrc` enables npm's legacy peer resolution, and the application is checked with an Angular production build.

## Run locally

```sh
npm install
npm start
```

Open the local URL printed by Angular CLI. Guest and table changes are saved in the current browser's local storage.

## Scripts

- `npm start` starts the development server.
- `npm run build` creates a production build in `dist/`.
- `npm test` runs the unit tests.
