# Contributing

## Get started

## docker-compose

If you want to avoid downloading or chaning your local environment, you can checkout the guide how to setup the frontend and backend for docker-compose [here](https://github.com/Kraftsportsklubben-av-1967/kk67-docker)

1. Clone docker-compose repo and follow guide

```sh
$ git clone git@github.com:Kraftsportsklubben-av-1967/kk67-docker.git
```

2. set up env variables in a `.env` file (**not** to be pushed to repo). Ask **Marius** for key(s).

```sh
VITE_GOOGLE_API_KEY = "<key>"
VITE_PROXY_PORT = 2000
```

> You can change the proxy_port number to whatever port you'd like but then you need to update the ports in the docker-compose

## Local development

This project is written in TypeScript with the Vue frontend framework using Prettier and ESlint for code formatting. You will need **Node** v20 and **Yarn** v1, matching the Docker Compose environment.

1. Install node v20. I recommend installing that with nvm

MacOS/Ubuntu: https://github.com/nvm-sh/nvm
Windows: https://nodejs.org/en/download/

```sh
$ nvm install 20
```

1. Make node v20 default

```sh
$ nvm alias default 20
```

3. Open a new terminal and verify node version (should return v20.X.X)

```sh
$ node -v
```

4. Install yarn

- Debian/Ubuntu: https://classic.yarnpkg.com/en/docs/install/#debian-stable
- macOS: https://classic.yarnpkg.com/en/docs/install/#mac-stable
- Windows: https://classic.yarnpkg.com/en/docs/install/

5. Open a new terminal and verify yarn version (should return 1.X.X)

```sh
$ yarn -v
```

6. Clone project

```sh
$ git clone git@github.com:Kraftsportsklubben-av-1967/kk67.git
$ cd kk67
```

7. Install dependencies

```sh
$ yarn
```

8. add lcp (local host proxy, [**link**](https://github.com/garmeeh/local-cors-proxy)) to $PATH

```sh
$ yarn global add local-cors-proxy
```

9. set up env variables in a `.env` file (**not** to be pushed to repo). Ask **Marius** for key(s).

```sh
VITE_GOOGLE_API_KEY = "<key>"
VITE_PROXY_PORT = "<unused_port_number>"
```

10. Start dev mode

```sh
$ yarn dev
```

11. Optionally you can host it to your local network such as this.

```sh
$ yarn dev:host
```

> All yarn scrips can be found in **package.json**

<br />
Open http://localhost:3000 on your favourite browser.

Cheers, hopefully!

## Naming convention

Visit this [page](https://github.com/Kraftsportsklubben-av-1967/.github/blob/main/README.md) for naming conventions

## Folders

- `src` is where the source code is located

## Source code

The source code is written in with [**Vue3**](https://v3.vuejs.org/) and [**TypeScript**](https://www.typescriptlang.org) and is located in the `src` folder. The application starts with the `src/main.ts` file.

### Tailwind

In order to avoid dealing with large unmaintanable _CSS_ files, we're using [**TailwinCSS**](https://tailwindcss.com/)

#### Get started with new tools

A quick introduction to the various tools we use can be found here

- [**Vue**](https://www.youtube.com/watch?v=nhBVL41-_Cw&ab_channel=Fireship)
- [**TypeScript**](https://www.youtube.com/watch?v=zQnBQ4tB3ZA&ab_channel=Fireship)
- [**TypeScript Tips**](https://www.youtube.com/watch?v=ahCwqrYpIuM&ab_channel=Fireship)

- [**TailwindCSS**](https://www.youtube.com/watch?v=mr15Xzb1Ook&ab_channel=Fireship)

## Test

Run `yarn test` for the feed regression tests, then `yarn build` for type checking
and the production build. The tests use Node's built-in test runner and the
existing Vite TypeScript loader; no separate test framework is required.

Feed tests mock the social API responses, so they need no network access or
credentials. They cover optional Instagram captions, deduplication, sorting,
session caching, and propagation of request failures.

## Editor

I recommend using Visual Studio Code as editor, but whatever you prefer will probably work. You might need to configure your editor to work with TypeScript, ESlint, Prettier, and Editorconfig.

### Visual Studio Code

#### Extensions

Editorconfig for VSCode:

- ESLint
- TailwindCSS
- Volar
- Prettier - Code formatter
- Bracket Pair Colorizer
- Vim (for legends)

#### Workspace settings -> settings.json

```json
{
  "editor.formatOnSave": true,
  "javascript.validate.enable": false,
  "typescript.autoImportSuggestions.enabled": false
}
```
