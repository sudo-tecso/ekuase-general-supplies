import QRCode from "qrcode";

/**
 * Generates a Data URL for a QR code.
 * @param text - The text to encode in the QR code.
 * @returns A promise that resolves to the Data URL.
 */
export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("QR Code generation failed:", err);
    throw err;
  }
}
