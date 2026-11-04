import bwipjs from 'bwip-js';

export class BarcodeService {
  /**
   * Generates a Code128 barcode as a base64 PNG data URI for specimen vial labels and tube stickers
   */
  static async generateBarcodeBase64(text: string, altText?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: 'code128',
          text,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
          alttext: altText || text
        },
        (err, png) => {
          if (err) {
            reject(err);
          } else {
            resolve(`data:image/png;base64,${png.toString('base64')}`);
          }
        }
      );
    });
  }

  /**
   * Generates an SVG string representation of Code128 barcode
   */
  static async generateBarcodeSvg(text: string, altText?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const svg = bwipjs.toSVG({
          bcid: 'code128',
          text,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
          alttext: altText || text
        });
        resolve(svg);
      } catch (err) {
        reject(err);
      }
    });
  }
}
