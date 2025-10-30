import React, { useEffect, useState } from 'react'
import { fetchRates } from './lib/exchange'
import { formatCurrency } from './lib/format'
import type { Currency } from './contents/currencies'

import './App.css'

function App() {
  const [from, setFrom] = useState<Currency>('JPY')
  const [to, setTo] = useState<Currency>('KRW')
  const [amountFrom, setAmountFrom] = useState<string>('')
  const [amountTo, setAmountTo] = useState<string>('')
  const [converting, setConverting] = useState<boolean>(false)
  const [convertError, setConvertError] = useState<boolean>(false)
  const [apiCheck, setApiCheck] = useState<string | null>(null)
  const [apiChecking, setApiChecking] = useState<boolean>(false)
  const currencies: Currency[] = ['JPY', 'KRW', 'SGD']

  useEffect(() => {
    // 状態確認用ログ
    console.log({ from, to })
  }, [from, to])

  const swap = () => {
    setConvertError(false)
    setFrom(to)
    setTo(from)
  }
  
  

  const isAmountFromValid = (() => {
    if (amountFrom.trim() === '') return false
    const decimal = /^\d+(?:\.\d+)?$/
    if (!decimal.test(amountFrom)) return false
    const n = Number(amountFrom)
    return Number.isFinite(n) && n >= 0
  })()

  const isSameCurrency = from === to

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors: string[] = []

    if (from === to) errors.push('同じ通貨同士は変換できません')
    if (!isAmountFromValid) errors.push('金額（変換前）が不正です')

    if (errors.length) {
      console.warn('Validation failed:', errors)
      setAmountTo('')
      setConvertError(false)
      return
    }

    // ② fetchRates(from) でレート取得
    try {
      setConverting(true)
      setConvertError(false)
      const rates = await fetchRates(from)
      // ③ to 通貨のレート抽出して amount * rate を計算
      const rate = rates[to]
      if (typeof rate !== 'number') {
        console.warn('Rate for target currency not found', { to, rates })
        setAmountTo('')
        setConvertError(true)
        return
      }
      const n = Number(amountFrom)
      // ④ 結果をロケール付き通貨表現で「変換後フォーム」に表示
      const converted = n * rate
      setAmountTo(formatCurrency(converted, to))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn('Failed to fetch rates:', msg)
      setAmountTo('')
      setConvertError(true)
    } finally {
      setConverting(false)
    }
  }

  const runApiCheck = async () => {
    try {
      setApiChecking(true)
      setApiCheck(null)
      const rates = await fetchRates(from)
      setApiCheck(`OK: ${Object.keys(rates).length} rates`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setApiCheck(`NG: ${msg}`)
    } finally {
      setApiChecking(false)
    }
  }

  return (
    <div className="converter">
      <h1 className="converter__title">為替レートアプリ</h1>
      <p className="converter__state">From: {from} → To: {to}</p>

      <form className="converter__form" action="#" noValidate onSubmit={handleSubmit}>
        <div className="converter__grid">
          {/* Selects row */}
          <div className="converter__control">
            <select
              name="currencies-before"
              aria-label="変換前の通貨"
              value={from}
              onChange={(e) => { setFrom(e.target.value as Currency); setConvertError(false) }}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button className="converter__swap" type="button" aria-label="通貨を入れ替え" onClick={swap}>⇄</button>

          <div className="converter__control">
            <select
              name="currencies-after"
              aria-label="変換後の通貨"
              value={to}
              onChange={(e) => { setTo(e.target.value as Currency); setConvertError(false) }}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Amounts row */}
          <input
            className="converter__amount"
            name="amount-from"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder=""
            value={amountFrom}
            onChange={(e) => { setAmountFrom(e.target.value); setConvertError(false) }}
          />
          <div />
          <input
            className="converter__amount"
            name="amount-to"
            type="text"
            inputMode="decimal"
            placeholder=""
            readOnly
            value={amountTo}
          />

          {/* Submit row */}
          <button className="converter__submit" type="submit" disabled={!isAmountFromValid || converting || isSameCurrency}>{converting ? '取得中…' : '変換'}</button>
          {isSameCurrency && (
            <small className="converter__warning" role="status" aria-live="polite">同じ通貨同士は変換できません</small>
          )}
          {convertError && (
            <small className="converter__error" role="status" aria-live="polite">レート取得に失敗しました</small>
          )}
        </div>
      </form>
      <div className="converter__apicheck">
        <button type="button" onClick={runApiCheck} disabled={apiChecking}>APIチェック</button>
        {apiCheck && (
          <small role="status" aria-live="polite" style={{ marginLeft: 8 }}>{apiCheck}</small>
        )}
      </div>
    </div>
  )
}

export default App

