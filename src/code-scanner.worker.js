/* eslint-disable no-restricted-globals */
import { scanImageData } from 'zbar.wasm';

self.addEventListener('message', async e => {
  const symbols = await scanImageData(e.data.imageData);
  const response = symbols.map((sym, i) => ({
    index: i,
    type: sym.typeName,
    value: sym.decode(),
    points: sym.points,
  }));
  self.postMessage({ response });
});
