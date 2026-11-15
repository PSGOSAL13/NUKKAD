/**
 * Cached Intl formatters. Creating an Intl.DateTimeFormat is slow on phones;
 * the calendar and menu format many values per render, so reuse them.
 */
const dates = new Map<string, Intl.DateTimeFormat>();
const numbers = new Map<string, Intl.NumberFormat>();

export function dateFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = locale + JSON.stringify(options);
  let f = dates.get(key);
  if (!f) dates.set(key, (f = new Intl.DateTimeFormat(locale, options)));
  return f;
}

export function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = locale + JSON.stringify(options);
  let f = numbers.get(key);
  if (!f) numbers.set(key, (f = new Intl.NumberFormat(locale, options)));
  return f;
}
