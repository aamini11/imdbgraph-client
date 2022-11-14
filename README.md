# Welcome to IMDB Graph's frontend

This Repo contains all the code for the frontend of [https://www.imdbgraph.org](https://www.imdbgraph.org). The website
is written in React/Typescript and uses NextJS as the frontend framework.

## How to run locally

To run the website locally, npm/yarn and Node.js are required. Once you've installed them, run the development server
using the following commands:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.

You can start editing any of the pages. It will auto-update as you edit the file without having to restart the server or
refresh the browser page. To learn more about this feature look at
the [NextJS documentation](https://nextjs.org/docs/basic-features/fast-refresh)

## API Routes

All API requests that start with /api are routed to the IMDB Graph backend server at https://api.imdbgraph.org. The
source code for the backend is hosted on a separate repo [here](https://gitlab.com/aamini11/imdbgraph).

## Linting and Formatting

All linting for this project is done through [ESLint](https://eslint.org/) and all formatting checked
using [Prettier](https://prettier.io/). These rules are also checked through the CI/CD whenever changes are pushed to
Gitlab. To run the checks locally use the following commands:

```bash
# Run ESLint
npm run lint

# Check for which files require formatting
npm run check-format

# Format all the files in the project
npm run format
```

## Unit Testing

To run tests use the command `npm test`

All unit tests are located in the [\_\_tests__](./__tests__) directory. Tests are written
using [Jest](https://jestjs.io/) as the test runner and [React Testing Library](https://testing-library.com/)
as the testing framework.

## Deployment

All changes pushed to master are automatically deployed to production using Vercel. Any changes to a
branch other than master are deployed to a staging URL for previewing changes before production.