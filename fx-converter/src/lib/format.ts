import type { Currency } from '../contents/currencies'

// Mapping of supported currencies to their appropriate locales
const CURRENCY_LOCALES: Record<Currency, string> = {
  JPY: 'ja-JP',
  KRW: 'ko-KR',
  SGD: 'en-SG'
}

/**
 * Return the best-fit locale for a given currency among supported ones.
 */
export function getLocaleForCurrency(currency: Currency): string {
  return CURRENCY_LOCALES[currency]
}

/**
 * Format a number as currency using Intl.NumberFormat and an auto-selected locale.
 */
export function formatCurrency(value: number, currency: Currency): string {
  const locale = getLocaleForCurrency(currency)
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

