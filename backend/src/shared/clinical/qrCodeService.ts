import QRCode from 'qrcode';

export class QrCodeService {
  /**
   * Generates a Data URL (base64 PNG) for QR verification of clinical reports & bills
   */
  static async generateQrCodeDataUrl(data: string): Promise<string> {
    try {
      return await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 200,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (err: any) {
      throw new Error(`Failed to generate QR code: ${err.message}`);
    }
  }

  /**
   * Generates an SVG string representation of the QR code
   */
  static async generateQrCodeSvg(data: string): Promise<string> {
    try {
      return await QRCode.toString(data, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 200
      });
    } catch (err: any) {
      throw new Error(`Failed to generate QR code SVG: ${err.message}`);
    }
  }
}
