# React Code Scanner

A react component to scan bar codes and qr codes, it uses the zbar.wasm library in a web worker.

This uses hooks, so needs React >= 16.8

## Install

`npm i react-code-scanner`

## Usage

```jsx
const [result, setResult] = useState('');
const [facingMode, setFacingMode] = useState('environment');

return (
  <div className="App">
    <h1>Code Scanner</h1>
    <div>Result: {result}</div>
    <div>
      <button onClick={() => setResult('')}>reset</button>
    </div>
    <div>
      <button
        onClick={() =>
          setFacingMode(facingMode === 'environment' ? 'user' : 'environment')
        }
      >
        current camera: {facingMode} switch camera
      </button>
    </div>
    <CodeScanner
      onResult={res => setResult(res.map(({ value }) => value).join(', '))}
      onError={setResult}
      facingMode={facingMode}
    />
  </div>
);
```

## Props

| name | default | meaning |
|------|---------|---------|
| width | 400 | the width in px of the camera view |
| height | 300 | the heigth in px of the camera view |
| onResult | console.log | the callback that is invoked when a code is decoded |
| onError | console.error | the callback that is invoked when an error occours |
| maxVideoWidth | 640 | the width in px of the image taken from the camera and passed to the scanner |
| maxVideoHeight | 640 | the width in px of the image taken from the camera and passed to the scanner |
| facingMode | 'environment' | this prop is used by devices with a back and a front camera and takes 2 values: 'environment' to use the back camera and 'user' to use the front camera |
| codeOverlayColor | '#00ff00' | the color of the code overlay that is dispalyed when a code is recognized |
| codeIndexColor | '#ff0000' | the color of the progressivo code id that is dispalyed when a code is recognized |
| mirrorUserImage | true | if true the component will mirror the image when using the front camera |
