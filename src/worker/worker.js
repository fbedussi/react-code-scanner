import { scanImageData as scan } from 'zbar.wasm';

export const scanImageData = async imageData => {
  const symbols = await scan(imageData);
  return symbols.map((sym, i) => ({
    index: i,
    type: sym.typeName,
    value: sym.decode(),
    points: sym.points,
  }));
};
