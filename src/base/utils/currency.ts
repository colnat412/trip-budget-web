export function formatCurrency(
  amount: number | string | null | undefined,
  currency = 'VND',
  locale = 'vi-VN',
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `0 ${currency}`;
  }

  const numericAmount = Number(amount);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: currency.toUpperCase() === 'VND' ? 0 : 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toLocaleString(locale)} ${currency}`;
  }
}

export function formatCompactCurrency(
  amount: number | string | null | undefined,
  currency = 'VND',
  locale = 'vi-VN',
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `0 ${currency}`;
  }

  const numericAmount = Number(amount);
  const curr = currency.toUpperCase();

  if (curr === 'VND') {
    const abs = Math.abs(numericAmount);
    const sign = numericAmount < 0 ? '-' : '';
    if (abs >= 1_000_000_000) {
      const val = (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
      return `${sign}${val} tỷ`;
    }
    if (abs >= 1_000_000) {
      const val = (abs / 1_000_000).toFixed(1).replace(/\.0$/, '');
      return `${sign}${val} tr`;
    }
    if (abs >= 1_000) {
      const val = (abs / 1_000).toFixed(0);
      return `${sign}${val}k`;
    }
    return `${numericAmount.toLocaleString(locale)} ₫`;
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(numericAmount);
  } catch {
    return formatCurrency(numericAmount, currency, locale);
  }
}

export function formatNumber(
  value: number | string | null | undefined,
  locale = 'vi-VN',
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }

  return Number(value).toLocaleString(locale);
}

export function formatNumberInput(
  value: number | string | null | undefined,
  allowDecimals = true,
): string {
  if (value === null || value === undefined || value === '') return '';
  const str = String(value).replace(/,/g, '');
  if (!allowDecimals) {
    const clean = str.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
    if (!clean) return '';
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const parts = str.split('.');
  const intPart = parts[0].replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
  const formattedInt = intPart
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : parts.length > 1
      ? '0'
      : '';
  if (parts.length > 1) {
    const decimalPart = parts[1].replace(/[^\d]/g, '');
    return `${formattedInt}.${decimalPart}`;
  }
  return formattedInt;
}

export function parseNumberInput(value: string | number | null | undefined): {
  numericValue: number | undefined;
  rawString: string;
} {
  if (value === null || value === undefined || value === '') {
    return { numericValue: undefined, rawString: '' };
  }
  const rawString = String(value).replace(/,/g, '').trim();
  if (rawString === '' || rawString === '.') {
    return { numericValue: undefined, rawString: '' };
  }
  const numericValue = Number(rawString);
  return {
    numericValue: isNaN(numericValue) ? undefined : numericValue,
    rawString,
  };
}
