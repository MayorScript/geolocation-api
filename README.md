# Geolocation Search Api (With Scoring Algorithm)

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
  - [Try the application](#try-the-application)
- [Technologies Used](#technologies-used)
- [License](#license)

## Introduction

This is an api that presents scored results based on a user’s search criteria.
This application has the following features:

- Transfer data from the provided CSV file
  to a database for efficient storage and retrieval.
- Scoring algorithm for user searches.
- Efficient Search algorithm using PostGIS for Geospatial calculations.
- Caching
- Rate Limiting
- Queue and batch processing
- Scalabe application structure
- Test driven development

## Getting Started

## Prerequisites

Make sure your environment has the following installed:

- Nodejs (version - 18^)
- Docker (You need docker & docker compose to be installed to run the application)

### Installation

To clone this repo onto your local machine:

1. Clone the repository from [GitHub Repo URL](https://github.com/MayorScript/geolocation-api.git).

   ```
   git clone https://github.com/MayorScript/geolocation-api.git
   ```

2. To get started, navigate to the project directory:

   ```
    cd geolocation-api
   ```

3. Copy `.env.test` to `.env` and fill in the required environment variables.
   ```
   cp .env.test .env
   ```
4. Run docker compose:
   ```
   docker compose up 
   ```
5. To run the unit tests:
   ```
   yarn test
   ```

---

# Project

## Project Structure

The project follows a standard directory structure:

```
geolocation-api/
│
├── dist/                # Output folder for compiled Javascript files
├── logs/                # Auto-generated app logs
├── src/                 # Source code
    |── config/          # App configuration
       └── ...
    |── controllers/     # Http request
    │   └── ...
    |── lib/             # Utility functions & API Services
       └── ...
    |── middlewares/     # App middlewares
    │   └── ...
    |── processes/      # Queue processes
    │   └── ...
    |── queues/         # Queue processes
    │   └── ...
    |── routes/          # App routes
    │   └── ...
    |── schema/          # Validation schema
    │   └── ...
    |── services/        # App business logic
    │   └── ...
    |── types/           # Typescript type declarations
    │   └── ...
    |── index.ts         # App entry point
    |── app.ts          # Server setup
├── .env.test           # Test environment variable
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation
└── ...

```

## Try the application

Starting from the root directory of your local repository, run:

The `src` folder contains the project's `package.json` file, `index.ts` which is the entry point to the application, and a `.env` file for managing environments.
The `NODE_ENV` variable in the `.env` file is used to set the application's environment configuration. As listed by the files within `src/config`, `NODE_ENV` can take one of 4 possible values: `test`, `local`, `development`, `production` - and if `NODE_ENV` is not set, the application uses the `default` configuration. For example, you can set the application to use the `local` configuration by updating `.env` with:

```
NODE_ENV=local
```

Do not add secrets directly into `.env`; any secret values should be managed by a Secret Manager.

## Libraries

- Node.js
- Express.js
- Docker
- Axios
- Winston
- Nodemon
- Jest
- Husky
- Github Actions
- Redis
- Bull
- Postgresql (Postgis)

## License

This project is licensed under the MIT License.
