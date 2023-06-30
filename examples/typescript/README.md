# Using Esptool-JS in a Typescript environment

This example has example code in `src/index.ts` which is called in the `index.html`. We are using Parcel to do bundle mechanism for the resulting JavaScript for simplicity here.

## Testing it locally

```
npm install
npm run dev
```

Then open http://localhost:1234 in Chrome or Edge. The `npm run dev` step will call Parcel which start a local http server serving `index.html` with compiled `index.ts`.