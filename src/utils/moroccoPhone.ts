/**
 * Helper to validate and format Moroccan and international phone numbers
 */
export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  cleanDigits: string;
  errorMessage?: string;
}

export function validateMoroccanPhone(input: string): PhoneValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      formatted: '',
      cleanDigits: '',
      errorMessage: 'Le numéro de téléphone est obligatoire.'
    };
  }

  // Remove spaces, dashes, dots, parentheses
  const cleaned = input.replace(/[\s\-\.\(\)]/g, '');

  // Case 1: Moroccan standard national format starting with 0 (e.g. 0612345678, 0712345678, 0528123456)
  const moroccoNationalRegex = /^0(5|6|7)\d{8}$/;
  if (moroccoNationalRegex.test(cleaned)) {
    const operator = cleaned.substring(1, 2);
    const part1 = cleaned.substring(2, 4);
    const part2 = cleaned.substring(4, 6);
    const part3 = cleaned.substring(6, 8);
    const part4 = cleaned.substring(8, 10);
    return {
      isValid: true,
      formatted: `+212 ${operator}${part1} ${part2} ${part3} ${part4}`,
      cleanDigits: `212${cleaned.substring(1)}`
    };
  }

  // Case 2: International Moroccan with +212 (e.g. +212612345678 or +2127...)
  const moroccoIntlWithPlus = /^\+212(5|6|7)\d{8}$/;
  if (moroccoIntlWithPlus.test(cleaned)) {
    const num = cleaned.replace('+212', '');
    const operator = num.substring(0, 1);
    const part1 = num.substring(1, 3);
    const part2 = num.substring(3, 5);
    const part3 = num.substring(5, 7);
    const part4 = num.substring(7, 9);
    return {
      isValid: true,
      formatted: `+212 ${operator}${part1} ${part2} ${part3} ${part4}`,
      cleanDigits: cleaned.replace('+', '')
    };
  }

  // Case 3: International Moroccan with 212 without plus (e.g. 212612345678)
  const moroccoIntlNoPlus = /^212(5|6|7)\d{8}$/;
  if (moroccoIntlNoPlus.test(cleaned)) {
    const num = cleaned.replace(/^212/, '');
    const operator = num.substring(0, 1);
    const part1 = num.substring(1, 3);
    const part2 = num.substring(3, 5);
    const part3 = num.substring(5, 7);
    const part4 = num.substring(7, 9);
    return {
      isValid: true,
      formatted: `+212 ${operator}${part1} ${part2} ${part3} ${part4}`,
      cleanDigits: cleaned
    };
  }

  // Case 4: Other general valid phone number (for international tourists in Agadir: +33, +44, +49 etc. min 9 digits)
  const generalIntlRegex = /^\+?[1-9]\d{7,14}$/;
  if (generalIntlRegex.test(cleaned)) {
    const withPlus = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
    return {
      isValid: true,
      formatted: withPlus,
      cleanDigits: cleaned.replace('+', '')
    };
  }

  return {
    isValid: false,
    formatted: input,
    cleanDigits: cleaned,
    errorMessage: 'Veuillez saisir un numéro valide (ex: 06 65 86 86 00 ou +212 6...)'
  };
}
