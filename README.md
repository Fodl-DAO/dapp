# FODL Interface

This is the dapp interface for the FODL Project.

## Install dependencies

Run `npm install`

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Configuration

All available configuration variables that might need to be changed for a private deployment can be found in: [config.json](src/config.json).
The user can change the addresses of the smart contracts in our system such as: registries, lenses, single sided staking, lp staking, rewards distributor).
Furthermore, the user can provide custom rpcs and chain ids to be used with walletconnect or the hardcoded defaults will be used.

## Build for production

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running in docker

Run `docker build -t fodl-dapp .` to build the docker image.
Run `docker run -dp 80:80 fodl-dapp` to run it in a container. The dapp will be accessible on port 80 on localhost.

## Contributing

To easily accept open source contributions we are using the Forking Workflow. A new developer wanting to implement a feature should:

1. Fork this repository
2. Create a branch for the feature with a suggestive name.
3. Develop said feature including tests
4. Submit a Pull Request (PR) to merge the branch into the master branch of this repo.
5. Wait for reviewers
6. Respond to reviewers' concerns
7. Wait for reviewers to accept the PR
