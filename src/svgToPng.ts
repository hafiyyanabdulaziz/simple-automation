export function triggerDownload(contentUrl: string, fileName: string) {
  const event = new MouseEvent('click', {
    bubbles: false,
    cancelable: true,
    view: window
  });

  const anchor = document.createElement('a');

  anchor.setAttribute('download', fileName);
  anchor.setAttribute('href', contentUrl);
  anchor.setAttribute('rel', 'noreferrer');
  anchor.setAttribute('target', '_blank');

  anchor.dispatchEvent(event);
}

export const convertSvgToPng = (
  svg: SVGElement,
  width: number,
  height: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const image = new Image();
    image.width = width;
    image.height = height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const url = `data:image/svg+xml,${encodeURIComponent(svgData)}`;

    image.addEventListener('load', function () {
      URL.revokeObjectURL(url);

      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not retrieve canvas content blob'));
          }
        }, 'image/png');
      } else {
        reject(new Error('Could not retrieve canvas context'));
      }
    });

    image.src = url;
  });
};
