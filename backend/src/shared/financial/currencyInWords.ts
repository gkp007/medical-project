/**
 * Convert numeric Indian Rupee amounts into Words (e.g. 1,650 -> "One Thousand Six Hundred Fifty Rupees Only")
 */

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertLessThanOneThousand(n: number): string {
  let current = '';

  if (n >= 100) {
    current += ones[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }

  if (n >= 20) {
    current += tens[Math.floor(n / 10)] + ' ';
    n %= 10;
  }

  if (n > 0) {
    current += ones[n] + ' ';
  }

  return current.trim();
}

export function amountInWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';

  const absNum = Math.floor(Math.abs(num));
  let result = '';

  const crores = Math.floor(absNum / 10000000);
  let remainder = absNum % 10000000;

  const lakhs = Math.floor(remainder / 100000);
  remainder %= 100000;

  const thousands = Math.floor(remainder / 1000);
  remainder %= 1000;

  if (crores > 0) {
    result += convertLessThanOneThousand(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    result += convertLessThanOneThousand(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    result += convertLessThanOneThousand(thousands) + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertLessThanOneThousand(remainder) + ' ';
  }

  return `${result.trim()} Rupees Only`;
}
