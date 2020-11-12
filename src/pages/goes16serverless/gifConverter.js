import GIFEncoder from 'gif-encoder-2';
import { createCanvas } from 'canvas';

function gifConverter(urls, width, height) {
  const encoder = new GIFEncoder(width, height);
  encoder.setDelay(500);
  encoder.start();

  let frames = urls.map(url => {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(ctx);
      };
      img.src = url;
    });
  });

  return Promise.all(frames)
    .then(frames => {
      frames.forEach(frame => encoder.addFrame(frame));
      encoder.finish();
      return encoder;
    });
}

export default gifConverter;
