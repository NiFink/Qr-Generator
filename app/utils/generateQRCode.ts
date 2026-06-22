import QRCodeStyling from "qr-code-styling";

interface GenerateQRCodeOptions {
  link: string;
  logoSrc?: string;
  fileName?: string;
  width?: number;
  height?: number;
}

export async function generateQRCode({
  link,
  logoSrc,
  fileName = "qrcode",
  width = 500,
  height = 500,
}: GenerateQRCodeOptions) {
  const QR_SIZE = Math.min(width, height) * 0.75;

  const qrCode = new QRCodeStyling({
    width: QR_SIZE,
    height: QR_SIZE,
    data: link,
    image: logoSrc,
    dotsOptions: {
      color: "#000",
      type: "rounded",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  });

  const qrBlob = await qrCode.getRawData("png");

  if (!(qrBlob instanceof Blob)) return;

  const img = new Image();
  img.src = URL.createObjectURL(qrBlob);

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Hintergrund weiß
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  const x = (width - QR_SIZE) / 2;
  const y = (height - QR_SIZE) / 2;

  ctx.drawImage(img, x, y, QR_SIZE, QR_SIZE);

  canvas.toBlob((blob) => {
    if (!blob) return;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName}.png`;
    a.click();
  });
}
