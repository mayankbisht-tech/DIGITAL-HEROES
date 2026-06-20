'use client';

import React from 'react';
import { Currency, TipMode } from './types';

interface Props {
  currency: Currency;
  billAmount: string;
  taxPercent: string;
  tipMode: TipMode;
  tipValue: string;
  onCurrencyChange: (v: Currency) => void;
  onBillAmountChange: (v: string) => void;
  onTaxPercentChange: (v: string) => void;
  onTipModeChange: (v: TipMode) => void;
  onTipValueChange: (v: string) => void;
}

export default function BillInputSection({
  currency,
  billAmount,
  taxPercent,
  tipMode,
  tipValue,
  onCurrencyChange,
  onBillAmountChange,
  onTaxPercentChange,
  onTipModeChange,
  onTipValueChange,
}: Props) {
  const billNum = parseFloat(billAmount);
  const taxNum = parseFloat(taxPercent);
  const tipNum = parseFloat(tipValue);

  const billError = billAmount !== '' && billNum < 0;
  const taxError = taxPercent !== '' && taxNum < 0;
  const tipError = tipValue !== '' && tipNum < 0;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
      <h2 className="text-base font-semibold text-slate-700 uppercase tracking-wide">
        Bill Details
      </h2>

      {/* Currency + Bill amount */}
      <div className="space-y-1">
        <label htmlFor="bill-amount" className="text-sm font-medium text-slate-600">
          Bill Amount
        </label>
        <div className="flex gap-2">
          <select
            id="currency"
            aria-label="Currency"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[80px]"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
          <input
            id="bill-amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            value={billAmount}
            onChange={(e) => onBillAmountChange(e.target.value)}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              billError ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
            }`}
          />
        </div>
        {billError && (
          <p className="text-xs text-red-500 mt-0.5">Bill amount cannot be negative.</p>
        )}
      </div>

      {/* Tax */}
      <div className="space-y-1">
        <label htmlFor="tax-percent" className="text-sm font-medium text-slate-600">
          Tax (%)
        </label>
        <input
          id="tax-percent"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0"
          value={taxPercent}
          onChange={(e) => onTaxPercentChange(e.target.value)}
          className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            taxError ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
          }`}
        />
        {taxError && (
          <p className="text-xs text-red-500 mt-0.5">Tax percentage cannot be negative.</p>
        )}
      </div>

      {/* Tip */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="tip-value" className="text-sm font-medium text-slate-600">
            Tip / Service Charge
          </label>
          {/* Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => onTipModeChange('percent')}
              className={`px-3 py-1.5 transition-colors ${
                tipMode === 'percent'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              %
            </button>
            <button
              type="button"
              onClick={() => onTipModeChange('flat')}
              className={`px-3 py-1.5 transition-colors ${
                tipMode === 'flat'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Flat
            </button>
          </div>
        </div>
        <input
          id="tip-value"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0"
          value={tipValue}
          onChange={(e) => onTipValueChange(e.target.value)}
          className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            tipError ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
          }`}
        />
        {tipError && (
          <p className="text-xs text-red-500 mt-0.5">Tip cannot be negative.</p>
        )}
      </div>
    </section>
  );
}
