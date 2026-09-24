function resolveLocale(locale?: string): string {
  if (locale && locale.trim()) return locale;
  if (typeof document !== 'undefined') {
    if (document.documentElement.lang) {
      return document.documentElement.lang;
    }
    const match = document.cookie.match(/trip-budget-locale=([^;]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return 'vi';
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency = 'VND',
  locale?: string,
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `0 ${currency}`;
  }

  const numericAmount = Number(amount);
  const curr = currency.toUpperCase();
  const resolved = resolveLocale(locale);
  const isEnglish = resolved.toLowerCase().startsWith('en');
  const targetLocale = isEnglish ? 'en-US' : 'vi-VN';

  if (curr === 'VND') {
    const formatted = numericAmount.toLocaleString(targetLocale, {
      maximumFractionDigits: 0,
    });
    return `${formatted} ₫`;
  }

  try {
    return new Intl.NumberFormat(targetLocale, {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toLocaleString(targetLocale)} ${currency}`;
  }
}

export function formatCompactCurrency(
  amount: number | string | null | undefined,
  currency = 'VND',
  locale?: string,
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `0 ${currency}`;
  }

  const numericAmount = Number(amount);
  const curr = currency.toUpperCase();
  const resolved = resolveLocale(locale);
  const isEnglish = resolved.toLowerCase().startsWith('en');
  const targetLocale = isEnglish ? 'en-US' : 'vi-VN';

  if (curr === 'VND') {
    const abs = Math.abs(numericAmount);
    const sign = numericAmount < 0 ? '-' : '';

    if (abs >= 1_000_000_000) {
      const val = (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
      return isEnglish ? `${sign}${val}B` : `${sign}${val} tỷ`;
    }
    if (abs >= 1_000_000) {
      const val = (abs / 1_000_000).toFixed(1).replace(/\.0$/, '');
      return isEnglish ? `${sign}${val}M` : `${sign}${val} tr`;
    }
    if (abs >= 1_000) {
      const val = (abs / 1_000).toFixed(1).replace(/\.0$/, '');
      return isEnglish ? `${sign}${val}K` : `${sign}${val}k`;
    }
    return `${numericAmount.toLocaleString(targetLocale)} ₫`;
  }

  try {
    return new Intl.NumberFormat(targetLocale, {
      style: 'currency',
      currency: curr,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(numericAmount);
  } catch {
    return formatCurrency(numericAmount, currency, targetLocale);
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
