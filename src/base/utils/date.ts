export type DateFormatPattern =
  | 'DD-MM-YYYY'
  | 'DD/MM/YYYY'
  | 'YYYY-MM-DD'
  | 'DD-MM'
  | 'DD/MM'
  | 'D MMMM, YYYY'
  | 'D MMMM'
  | string;

/**
 * Parses any valid date input into a Date object or null if invalid.
 */
export function parseDate(
  dateInput: string | number | Date | null | undefined,
): Date | null {
  if (!dateInput) return null;
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Formats a date using a specified pattern (default: DD-MM-YYYY).
 *
 * @example
 * formatDate('2025-08-04') // '04-08-2025'
 * formatDate('2025-08-04', 'DD/MM/YYYY') // '04/08/2025'
 * formatDate('2025-08-04', 'D MMMM, YYYY') // '4 tháng 8, 2025'
 */
export function formatDate(
  dateInput: string | number | Date | null | undefined,
  format: DateFormatPattern = 'DD-MM-YYYY',
): string {
  const date = parseDate(dateInput);
  if (!date) return '';

  const day = date.getDate();
  const dayPadded = String(day).padStart(2, '0');
  const month = date.getMonth() + 1;
  const monthPadded = String(month).padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'DD-MM-YYYY') {
    return `${dayPadded}-${monthPadded}-${year}`;
  }
  if (format === 'DD/MM/YYYY') {
    return `${dayPadded}/${monthPadded}/${year}`;
  }
  if (format === 'YYYY-MM-DD') {
    return `${year}-${monthPadded}-${dayPadded}`;
  }
  if (format === 'DD-MM') {
    return `${dayPadded}-${monthPadded}`;
  }
  if (format === 'DD/MM') {
    return `${dayPadded}/${monthPadded}`;
  }
  if (format === 'D MMMM, YYYY') {
    return `${day} tháng ${month}, ${year}`;
  }
  if (format === 'D MMMM') {
    return `${day} tháng ${month}`;
  }

  return format
    .replace(/YYYY/g, String(year))
    .replace(/YY/g, String(year).slice(-2))
    .replace(/MM/g, monthPadded)
    .replace(/M/g, String(month))
    .replace(/DD/g, dayPadded)
    .replace(/D/g, String(day));
}

/**
 * Formats a start and end date range into a formatted string (default: DD-MM-YYYY – DD-MM-YYYY).
 *
 * @example
 * formatDateRange('2025-08-04', '2025-08-08') // '04-08-2025 – 08-08-2025'
 * formatDateRange('2025-08-04', '2025-08-08', 'DD/MM/YYYY') // '04/08/2025 – 08/08/2025'
 */
export function formatDateRange(
  startDate: string | number | Date | null | undefined,
  endDate: string | number | Date | null | undefined,
  format: DateFormatPattern = 'DD-MM-YYYY',
  separator = ' – ',
): string {
  const startStr = formatDate(startDate, format);
  const endStr = formatDate(endDate, format);

  if (startStr && endStr) {
    return `${startStr}${separator}${endStr}`;
  }
  return startStr || endStr || '';
}
