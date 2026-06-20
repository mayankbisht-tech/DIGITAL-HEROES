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

const labelClass = 'block text-xs font-sans font-semibold text-stone uppercase tracking-widest mb-1';
const inputClass =
  'w-full bg-paper border border-stone/30 rounded-[3px] px-3 py-2.5 text-sm font-sans text-ink tabular placeholder-stone/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold';
const inputErrClass =
  'w-full bg-red-50 border border-red-400 rounded-[3px] px-3 py-2.5 text-sm font-sans text-ink tabular focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500';

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

  const billError = billAmount !== '' && (billNum < 0 || billNum > 9_999_999.99);
  const taxError = taxPercent !== '' && (taxNum < 0 || taxNum > 100);
  const tipError =
    tipValue !== '' &&
    (tipNum < 0 || (tipMode === 'percent' && tipNum > 100));

  return (
    <section className="space-y-4">
      {/* Section heading */}
      <h2 className="font-serif text-gold text-base font-bold tracking-wide">
        Bill Details
      </h2>

      {/* Currency + Bill amount */}
      <div>
        <label htmlFor="bill-amount" className={labelClass}>
          Bill Amount
        </label>
        <div className="flex gap-2">
          <select
            id="currency"
            aria-label="Currency"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
            className="bg-paper border border-stone/30 rounded-[3px] px-2 py-2.5 text-sm font-sans text-ink focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold min-w-[76px]"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
          <input
            id="bill-amount"
            type="number"
            min="0"
            max="9999999.99"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            value={billAmount}
            onChange={(e) => onBillAmountChange(e.target.value)}
            className={`flex-1 ${billError ? inputErrClass : inputClass}`}
          />
        </div>
        {billError && (
          <p className="text-xs text-red-600 mt-1">
            Bill must be between 0.01 and 9,999,999.99.
          </p>
        )}
      </div>

      {/* Tax */}
      <div>
        <label htmlFor="tax-percent" className={labelClass}>
          Tax (%)
        </label>
        <input
          id="tax-percent"
          type="number"
          min="0"
          max="100"
          step="0.01"
          inputMode="decimal"
          placeholder="0"
          value={taxPercent}
          onChange={(e) => onTaxPercentChange(e.target.value)}
          className={taxError ? inputErrClass : inputClass}
        />
        {taxError && (
          <p className="text-xs text-red-600 mt-1">Tax must be between 0 and 100%.</p>
        )}
      </div>

      {/* Tip */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="tip-value" className={labelClass.replace('mb-1', '')}>
            Tip / Service Charge
          </label>
          {/* % / Flat toggle */}
          <div className="flex rounded-[3px] overflow-hidden border border-stone/30 text-xs font-sans font-semibold">
            <button
              type="button"
              onClick={() => onTipModeChange('percent')}
              className={`px-3 py-1.5 transition-colors min-h-[32px] ${
                tipMode === 'percent'
                  ? 'bg-gold text-navy'
                  : 'bg-paper text-stone hover:bg-stone/10'
              }`}
            >
              %
            </button>
            <button
              type="button"
              onClick={() => onTipModeChange('flat')}
              className={`px-3 py-1.5 transition-colors min-h-[32px] ${
                tipMode === 'flat'
                  ? 'bg-gold text-navy'
                  : 'bg-paper text-stone hover:bg-stone/10'
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
          className={tipError ? inputErrClass : inputClass}
        />
        {tipError && (
          <p className="text-xs text-red-600 mt-1">
            {tipMode === 'percent' ? 'Tip must be between 0 and 100%.' : 'Tip cannot be negative.'}
          </p>
        )}
      </div>
    </section>
  );
}
