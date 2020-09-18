import React, { useEffect, useRef } from 'react';
import ScannerWorker from './code-scanner.worker';

const scannerWorker = new ScannerWorker();

const SCAN_PROID_MS = 800;

export const scanImageData = imageData => {
  return new Promise(res => {
    const cb = e => {
      res(e.data.response);
    };
    scannerWorker.addEventListener('message', cb);
    scannerWorker.postMessage({
      imageData,
    });
  });
};

const init = async ({ video, maxVideoWidth, maxVideoHeight, facingMode }) => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode,
      width: { max: maxVideoWidth },
      height: { max: maxVideoHeight },
    },
  });
  video.srcObject = mediaStream;
  video.play();
  await new Promise(r => {
    video.onloadedmetadata = r;
  });
};

const renderOverlay = ({
  canvas,
  codes,
  facingMode,
  codeOverlayColor,
  codeIndexColor,
  mirrorUserImage,
}) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.font = '20px serif';
  ctx.strokeStyle = codeOverlayColor;
  ctx.fillStyle = codeIndexColor;
  ctx.lineWidth = 6;
  codes.forEach((sym, i) => {
    const points = sym.points;
    ctx.beginPath();
    for (let j = 0; j < points.length; ++j) {
      const { x, y } = points[j];
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    ctx.stroke();
    ctx.scale(getScaleX(mirrorUserImage, facingMode), 1);
    ctx.fillText('#' + i, points[0].x, points[0].y - 10);
    ctx.scale(1, 1);
  });
};

const processImage = async ({
  video,
  canvas,
  onResult,
  facingMode,
  codeOverlayColor,
  codeIndexColor,
  mirrorUserImage,
}) => {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  if (!width || !height) {
    return;
  }

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const codes = await scanImageData(imgData);
  renderOverlay({
    canvas,
    codes,
    facingMode,
    codeOverlayColor,
    codeIndexColor,
    mirrorUserImage,
  });
  if (codes.length) {
    onResult(codes);
  }
};

const sleep = ms =>
  new Promise(r => {
    setTimeout(r, ms);
  });

const main = async ({
  video,
  canvas,
  onResult,
  onError,
  maxVideoWidth,
  maxVideoHeight,
  facingMode,
  codeOverlayColor,
  codeIndexColor,
  mirrorUserImage,
}) => {
  try {
    await init({ video, maxVideoWidth, maxVideoHeight, facingMode });

    while (true) {
      await processImage({
        video,
        canvas,
        onResult,
        facingMode,
        codeOverlayColor,
        codeIndexColor,
        mirrorUserImage,
      });
      await sleep(SCAN_PROID_MS);
    }
  } catch (err) {
    onError(err.message);
  }
};

const getScaleX = (mirrorUserImage, facingMode) =>
  mirrorUserImage && facingMode === 'user' ? -1 : 1;

const CodeScanner = parentProps => {
  const defaultOptions = {
    width: 400,
    height: 300,
    onResult: console.log,
    onError: console.error,
    maxVideoWidth: 640,
    maxVideoHeight: 640,
    facingMode: 'environment',
    codeOverlayColor: '#00ff00',
    codeIndexColor: '#ff0000',
    mirrorUserImage: true,
  };
  const options = {
    ...defaultOptions,
    ...parentProps,
  };
  const {
    width,
    height,
    onResult,
    onError,
    maxVideoWidth,
    maxVideoHeight,
    facingMode,
    codeOverlayColor,
    codeIndexColor,
    mirrorUserImage,
  } = options;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      main({
        video: videoRef.current,
        canvas: canvasRef.current,
        onResult,
        onError,
        maxVideoWidth,
        maxVideoHeight,
        facingMode,
        codeOverlayColor,
        codeIndexColor,
        mirrorUserImage,
      });
    }
  }, [
    videoRef,
    canvasRef,
    onResult,
    onError,
    maxVideoWidth,
    maxVideoHeight,
    facingMode,
    codeOverlayColor,
    codeIndexColor,
    mirrorUserImage,
  ]);

  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${width}px`,
    height: `${height}px`,
  };
  return (
    <div
      style={{
        ...style,
        position: 'relative',
        transform: `scaleX(${getScaleX(mirrorUserImage, facingMode)})`,
      }}
    >
      <video ref={videoRef} width={width} height={height} style={style} />
      <canvas ref={canvasRef} width={width} height={height} style={style} />
    </div>
  );
};

export default CodeScanner;
