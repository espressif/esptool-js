# Using Esptool-JS in a Typescript environment

This example has example code in `src/index.ts` which is called in the `index.html`. We are using Parcel to bundle resulting files for simplicity here.

**NOTE:** This example is linked to the documentation generated from the source code. You could remove such dependency if necessary by remove `./docs/index.html` from `src/index.html` if you need so. NPM commands used below will generate documentation as well.

## Testing it locally

```
npm install
npm run dev
```

Then open http://localhost:1234 in Chrome or Edge. The `npm run dev` step will call Parcel which start a local http server serving `index.html` with compiled `index.ts`.

## Generate build to publish

```
npm install
npm run build
```

Copy the content of `dist` to your static pages service like Github pages.