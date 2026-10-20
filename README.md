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

## Production CI

GitHub Actions on Ubuntu runs uploader regressions, `yarn test` and `yarn build`
on pull requests to `master`. The Node.js test runner discovers application tests
when present; this deployment change does not add application features or their tests.
After a merge or push to `master`, CI also uploads the build using this repository's
`scripts\upload-frontend.ps1` and `scripts\ftps.psm1`. It checks out only this
repository, with no Docker-repository checkout or deployment controller pin.
Pull requests never upload files or receive production FTP credentials or the
Google Maps key.

Configure these repository secrets under **Settings > Secrets and variables >
Actions**: `FTP_USERNAME`, `FTP_PASSWORD`, and `VITE_GOOGLE_API_KEY`. Missing
production secrets stop deployment. Do not commit a `.env` file.

The destination is `ftp.c9ry3m6by.service.one`, directory `webroots/r1058728`.
Deployments run one at a time; a newer merge does not cancel an active upload.
The uploader never deletes remote files, preserving server routing configuration
and separately uploaded media. Uploads are not atomic and have no automatic rollback.

Uploader regressions run with Python 3 and PowerShell 7:

```powershell
python -m unittest discover -s tests -p "test_*.py"
```

### Local FTPS deployment

Use PowerShell 7 on Windows or Linux, Node.js 20.12 or newer, Yarn, and native
`curl` with FTPS support. To choose between installations, put the intended
executable's directory first on `PATH`.

From this repository, preview without connecting or reading credentials:

```powershell
pwsh -File .\scripts\upload-frontend.ps1 -WhatIf
```

Remove `-WhatIf` to build and upload, or add `-SkipBuild` to reuse `dist`.
An explicit `-Credential` takes precedence. Otherwise, the uploader reads
`FTP_USERNAME` and `FTP_PASSWORD` from this repository's ignored `.env`, then
prompts securely if both are absent. A partial pair fails before connecting.
Never prefix FTP secrets with `VITE_`.

To keep credentials in a separate private file, including an existing
Docker-root `.env`, pass `-EnvFilePath` to that file. No password copy is needed.
An explicitly selected missing file fails unless `-Credential` is supplied.
`-WhatIf` never reads that file or connects. Local saved passwords remain
plaintext; keep the file private and outside build output.

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

## Font loading

If text changes after opening a map, check the global Roboto stylesheet in
[index.html](index.html). It must include the full 100-900 weight range; otherwise
Google Maps can add missing weights and change typography on other pages.

## Page layout

Navigation and route content share 32px side gutters inside the responsive
container. If a page looks narrower or its edges no longer align with the navbar,
check for extra outer widths or margins in that view; the shared wrappers in
`App.vue` and `Header.vue` already provide them. Homepage feed cards below 768px
and gallery images below 640px intentionally reach the viewport edges.

The homepage photo shares these gutters and uses a centred crop rather than
stretching; its responsive height stays unchanged.

## NM 2027

The `/nm` route is available from both navigation menus. Desktop navigation stays
on one row, switching to the hamburger menu at 1230px and below, or whenever the
row cannot fit within the content margins. Homepage navigation sits on a solid
black strip above the photo; other pages keep their light headers.

Event dates, venue and media settings live in `src/constants/nm.ts`. The four large
cards show full 24-hour days remaining; the smaller red-on-black cards show the
remaining hours, minutes and seconds. All digits stop at zero when the target is reached.

Until the event start time is confirmed, `countdownAt` is midnight on 19 June
2027 in Oslo (`2027-06-19T00:00:00+02:00`), not an announced lifting time.
Use an ISO timestamp with an explicit UTC offset when updating it. This combined
countdown replaces the earlier calendar-day count, so its day number can be one
lower while the smaller clock shows the rest of the day.

The official NM logo is bundled at `assets/public/logo/nm-2027-logo.png` and shown
in the hero. It is included in normal builds and needs no separate manual upload.

The location section offers walking and driving routes from Quality Hotel Prinsen
to Studentersamfundet. Addresses are in the event settings. Routes come from
Google Maps; the external directions link works independently of the embedded map.

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

Run `yarn test` for the focused regressions and `yarn build` for type-checking and
the production build.

## Google Maps

Both the club location map and the NM route use the existing `VITE_GOOGLE_API_KEY`
from the frontend `.env`. Never commit this file or the key. Restart Vite or rebuild
after changing environment settings.

Both maps use `AdvancedMarkerElement` with the shared JavaScript map ID in
`src/utils/googleMaps.ts`. The map ID is public styling/configuration, not an API
key. The club-logo marker remains clickable; the NM markers identify the hotel
and arena. Google requires a valid JavaScript map ID for advanced markers.

If the console reports `RefererNotAllowedMapError`, open the existing key in
[Google Cloud credentials](https://console.cloud.google.com/apis/credentials) and
add the site's origin to its allowed websites. For this Docker preview, use
`http://localhost:3000/*`. Keep existing production restrictions; do not replace
them with an unrestricted wildcard. Reload the page after the change has propagated.

The NM route also requires **Routes API** to be enabled in the same project and
allowed in the key's API restrictions, alongside **Maps JavaScript API**. It uses
the current Routes library, not Directions API (Legacy). Google usage pricing applies.
If the map loads but directions fail, check those service restrictions and the
browser console. Authentication, network and route errors are shown on the page
instead of leaving an unexplained blank map.
