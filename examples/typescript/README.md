# Using Esptool-JS in a Typescript environment

Typescript example shows basic usage of esptool-js in static html js website with Webserial. The main code is in `src/index.ts` which is called in the `index.html`. 

We are using Parcel to bundle resulting files for simplicity here.

**NOTE:** This example is linked to the documentation generated from the source code. You could remove such dependency if necessary by remove `./docs/index.html` from `src/index.html` if you need so. NPM commands used below will generate documentation as well.

## Testing it locally

```
npm install
npm run dev
```

Then open http://localhost:1234 in Chrome or Edge. The `npm run dev` step will call Parcel which start a local http server serving `index.html` with compiled `index.ts`.

## Generate build to publish

Build the library from the repository root first, so `lib/` exists:

```
npm install
npm run build
cd examples/typescript
npm install
npm run build
```

`npm run dev` and `npm run build` generate API docs at the repository root, then copy them into `dist/docs`. `npm run build` writes the static site to `dist/` with relative URLs (`--public-url ./`) so it can be served from a subdirectory.

The Pages workflow publishes `dist/` to the `gh-pages` branch. Set Pages to deploy from the `gh-pages` branch and the `/ (root)` folder. The site is https://espressif.github.io/esptool-js/ and the API reference is https://espressif.github.io/esptool-js/docs/. A pull request from the same repository publishes a preview at `https://espressif.github.io/esptool-js/pr-preview/pr-<number>/`.