# Avatar library bundle

`player/js/micah.js` is a self-contained bundle of [DiceBear](https://www.dicebear.com) (MIT) with the
**Micah** avatar style by Micah Lanier (artwork licensed CC BY 4.0,
https://www.figma.com/community/file/829741575478342595). It exposes `window.MicahAvatar(options) -> data URI`.

To rebuild (only needed when upgrading DiceBear):

```bash
cd tools/avatar_lib
npm install @dicebear/core@9 @dicebear/micah@9 esbuild
npx esbuild entry.js --bundle --minify --format=iife --target=es2017 \
  --banner:js="/* DiceBear (MIT) + Micah avatar style by Micah Lanier (CC BY 4.0) */" \
  --outfile=../../player/js/micah.js
python3 ../build.py
```
