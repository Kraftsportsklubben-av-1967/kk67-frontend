# KK67 - Website

This is the source code for the KK-67 website (currently in development).

<br >

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Website Concept:

A concept draft has been approved by KK-67 leader, **Jostein Fiveltun**.

Our aim is to develop a website that matches the concept draft provided [**here**](./design/)

![front.png](assets/front.png)

![location.png](assets/location.png)

![photos.png](assets/photos.png)

<br >

# Get started

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Contribute

This website is maintained by [**Marius Arhaug**](https://www.github.com/MariusArhaug).

To contribute to this project, follow the guidelines described in the [CONTRIBUTING.md](./CONTRIBUTING.md)

## Available Scripts

In the project directory, you can run:

```sh
$ yarn install
```

Installs the nessesary dependencies defined in [package.json](package.json)

```sh
$ yarn dev
```

Runs the app in the development mode.\
Open [**http://localhost:3000**](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

```sh
$ yarn dev:host
```

Runs the app in development mode and also hosts the localhost to your local network. Allowing you to view the website from other computers or even phones! The terminal will provide ip addresses for you to use.

<br >

```sh
$ yarn build
```

Transpile `TypeScript` into `JavaScript` and check for build errors.

```sh
yarn preview
```

Previews the built package as if it were to be deployed.

## NM 2027

The `/nm` route is available from both navigation menus. Event dates, venue and
media settings live in `src/constants/nm.ts`. The four-card countdown
shows calendar days remaining and changes at midnight in `Europe/Oslo`, including
daylight-saving transitions: `0245` means 245 days remaining. It stops at `0000`
on the first event day.

The official NM logo is bundled at `assets/public/logo/nm-2027-logo.png` and shown
in the hero. It is included in normal builds and needs no separate manual upload.

The temporary video is a local copy of **KK Final Draft.mp4**, played with native
browser controls. Put it at `assets/public/videos/nm-2027-promo.mp4`; this exact
file is Git-ignored and must not be committed. Its URL, configured by `mp4Url`, is
`/public/videos/nm-2027-promo.mp4`.

For deployment, upload the MP4 separately to `public/videos/nm-2027-promo.mp4`
under the website's document root. A build from a clean clone does not contain it.
A local build with the file present copies it to `dist/public/videos/`.
If the player reports that the video could not load, check that the URL serves
the MP4, not the SPA's HTML fallback.

Set `youtubeVideoId` to an 11-character YouTube video ID once it is published there.
YouTube automatically replaces the local player and stops requesting the MP4.
Its privacy-enhanced player loads only after the visitor activates “Last inn video”.
The local player preloads metadata without autoplay. If both `youtubeVideoId` and
`mp4Url` are `null`, the page shows “Video kommer”.

Run `yarn test` for the countdown and video regressions and `yarn build` for type-checking and
the production build.
