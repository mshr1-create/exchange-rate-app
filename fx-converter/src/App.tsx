import React, { useEffect, useState } from 'react'
import { fetchRates } from './lib/exchange'
import type { Currency } from './contents/currencies'

import './App.css'

function App() {
  const [from, setFrom] = useState<Currency>('JPY')
  const [to, setTo] = useState<Currency>('KRW')
  const [amountFrom, setAmountFrom] = useState<string>('')
  const [apiCheck, setApiCheck] = useState<string | null>(null)
  const [apiChecking, setApiChecking] = useState<boolean>(false)
  const currencies: Currency[] = ['JPY', 'KRW', 'SGD']

  useEffect(() => {
    // 状態確認用ログ
    console.log({ from, to })
  }, [from, to])

  const swap = () => {
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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    const errors: string[] = []

    if (from === to) errors.push('同じ通貨同士は変換できません')
    if (!isAmountFromValid) errors.push('金額（変換前）が不正です')

    if (errors.length) {
      console.warn('Validation failed:', errors)
      return
    }

    console.log('Validation succeeded. Ready to convert.', { from, to, amountFrom })
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
              onChange={(e) => setFrom(e.target.value as Currency)}
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
              onChange={(e) => setTo(e.target.value as Currency)}
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
            onChange={(e) => setAmountFrom(e.target.value)}
          />
          <div />
          <input className="converter__amount" type="text" placeholder="" />

          {/* Submit row */}
          <button className="converter__submit" type="submit" disabled={!isAmountFromValid}>変換</button>
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

