import React, { useEffect, useState } from 'react'
import type { Currency } from './contents/currencies'

import './App.css'

function App() {
  const [from, setFrom] = useState<Currency>('JPY')
  const [to, setTo] = useState<Currency>('KRW')
  const currencies: Currency[] = ['JPY', 'KRW', 'SGD']

  useEffect(() => {
    // 状態確認用ログ
    console.log({ from, to })
  }, [from, to])

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  return (
    <div className="converter">
      <h1 className="converter__title">為替レートアプリ</h1>
      <p className="converter__state">From: {from} → To: {to}</p>

      <form className="converter__form" action="#">
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
          <input className="converter__amount" type="text" placeholder="" />
          <div />
          <input className="converter__amount" type="text" placeholder="" />

          {/* Submit row */}
          <button className="converter__submit" type="submit">変換</button>
        </div>
      </form>
    </div>
  )
}

export default App

