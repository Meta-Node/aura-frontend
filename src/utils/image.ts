import blockies from 'ethereum-blockies';

export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  borderRadius?: number,
) {
  // Get the dimensions of the image
  const imgWidth = img.width;
  const imgHeight = img.height;

  if (borderRadius) {
    const x = 0,
      y = 0,
      radius = borderRadius,
      width = canvasWidth,
      height = canvasHeight;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.clip();
  }

  // Draw the image to the canvas
  ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  ctx.restore();
}

export const createBlockiesImage = (seed: string) => {
  return blockies.create({
    seed,
    size: 10,
    scale: 3,
    color: '#5B9969',
    bgcolor: '#D5ECDA',
    spotcolor: 128,
  });
};

export async function renderImageCover(
  imageContent: string,
  width: number,
  height: number,
) {
  const image = new Image();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d')!;

  image.src = imageContent;

  return await new Promise<string>(
    (resolve) =>
      (image.onload = () => {
        drawImageCover(context, image, width, height, 12);

        const data = canvas.toDataURL();

        canvas.remove();

        resolve(data);
      }),
  );
}

// // Usage Example
// const canvas = document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');
// const img = new Image();
// img.src = 'your-image-url.jpg';

// img.onload = () => {
//   canvas.width = 800; // Dynamic width
//   canvas.height = 600; // Dynamic height
//   drawImageCover(ctx, img, canvas.width, canvas.height);
// };
