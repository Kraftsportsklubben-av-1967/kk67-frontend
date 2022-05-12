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

This project is written in TypeScript with the Vue frontend framework using Prettier and ESlint for code formatting. You will need **Node** v14 and **Yarn**.

1. Install node v14. I recommend installing that with nvm

MacOS/Ubuntu: https://github.com/nvm-sh/nvm
Windows: https://nodejs.org/en/download/

```sh
$ nvm install 14
```

1. Make node v14 default

```sh
$ nvm alias default 14
```

3. Open a new terminal and verify node version (should return v14.X.X)

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

<!--
# //TODO add testing library for vue
## Test

Jest (https://jestjs.io) is used for testing. All files within the `src` folder with the `<FILENAME>.test.ts` format will automatically be picked up by Jest.

You can run the tests including generating a coverage report with:

- `yarn test`

You can start jest with watch mode with:

- `yarn jest:watch`

You can run one single test file by running `yarn jest:watch <FILENAME>`, for example `yarn jest:watch src/..<FILENAME>.test.ts`.
-->

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
