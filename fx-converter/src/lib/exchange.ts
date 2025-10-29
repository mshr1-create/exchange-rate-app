import type { Currency } from '../contents/currencies'

export type ConversionRates = Record<string, number>

export type ExchangeApiResponse = {
  base_code: string
  conversion_rates: ConversionRates
  result?: string
  time_last_update_utc?: string
}

/**
 * Fetch conversion rates for the given base currency.
 * Requires Vite env vars: VITE_EXCHANGE_RATE_API_KEY, VITE_EXCHANGE_RATE_BASE_URL
 * Example URL shape: {BASE_URL}/{API_KEY}/latest/{base}
 */
export async function fetchRates(base: Currency): Promise<ConversionRates> {
  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY as string | undefined
  const baseUrl = import.meta.env.VITE_EXCHANGE_RATE_BASE_URL as string | undefined

  if (!apiKey) throw new Error('Missing VITE_EXCHANGE_RATE_API_KEY')
  if (!baseUrl) throw new Error('Missing VITE_EXCHANGE_RATE_BASE_URL')

  const normalizedBase = baseUrl.replace(/\/$/, '')
  const url = `${normalizedBase}/${encodeURIComponent(apiKey)}/latest/${encodeURIComponent(base)}`

  let res: Response
  try {
    res = await fetch(url)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`Network error while fetching rates: ${msg}`)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const extra = body ? ` - ${body}` : ''
    throw new Error(`Exchange API error ${res.status} ${res.statusText}${extra}`)
  }

  let data: ExchangeApiResponse
  try {
    data = await res.json()
  } catch {
    throw new Error('Invalid JSON returned by exchange API')
  }

  if (!data || typeof data.conversion_rates !== 'object') {
    throw new Error('Malformed response: missing conversion_rates')
  }

  return data.conversion_rates
}

