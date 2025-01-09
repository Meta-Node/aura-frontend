export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  // Get the dimensions of the image
  const imgWidth = img.width;
  const imgHeight = img.height;

  // Calculate aspect ratios
  const imgAspectRatio = imgWidth / imgHeight;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let renderWidth, renderHeight, offsetX, offsetY;

  // Determine whether to scale by width or height
  if (canvasAspectRatio > imgAspectRatio) {
    // Scale by height
    renderHeight = canvasHeight;
    renderWidth = renderHeight * imgAspectRatio;
    offsetX = (canvasWidth - renderWidth) / 2; // Center horizontally
    offsetY = 0; // No vertical offset
  } else {
    // Scale by width
    renderWidth = canvasWidth;
    renderHeight = renderWidth / imgAspectRatio;
    offsetX = 0; // No horizontal offset
    offsetY = (canvasHeight - renderHeight) / 2; // Center vertically
  }

  // Draw the image to the canvas
  ctx.drawImage(img, 0, 0, renderWidth, renderHeight);
}

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
        drawImageCover(context, image, width + 20, height + 20);

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
