'use client';

import React, { useState } from 'react';
import { PersonResult, Currency } from './types';
import { formatAmount } from './calculator';

interface Props {
  results: PersonResult[];
  grandTotal: number;
  taxAmount: number;
  tipAmount: number;
  currency: Currency;
  onReset: () => void;
}

// ── Denomination breakdown (INR greedy) ──────────────────────────────────────
const NOTES = [500, 200, 100, 50, 20, 10] as const;

interface DenomPiece {
  denomination: number;
  count: number;
  isCoins: boolean;
}

function breakIntoNotes(amount: number): DenomPiece[] {
  const rupees = Math.round(amount); // nearest whole rupee
  let remainder = rupees;
  const pieces: DenomPiece[] = [];
  for (const note of NOTES) {
    const count = Math.floor(remainder / note);
    if (count > 0) {
      pieces.push({ denomination: note, count, isCoins: false });
      remainder -= count * note;
    }
  }
  if (remainder > 0) {
    pieces.push({ denomination: remainder, count: 1, isCoins: true });
  }
  return pieces;
}

// Segment colors cycling through stone/gold tones
const SEGMENT_COLORS = [
  '#C9962B', // gold
  '#b8851f', // gold-dark
  '#7A7466', // stone
  '#9b9189', // stone-light
  '#d4a93e', // gold-mid
  '#6a6459', // stone-dark
];

function DenomBar({ pieces, total }: { pieces: DenomPiece[]; total: number }) {
  if (total === 0 || pieces.length === 0) return null;

  return (
    <div
      className="flex rounded-[2px] overflow-hidden h-4"
      role="img"
      aria-label="Denomination breakdown bar"
    >
      {pieces.map((p, i) => {
        const value = p.denomination * p.count;
        const pct = (value / total) * 100;
        return (
          <div
            key={i}
            style={{
              width: `${pct}%`,
              backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
            }}
            title={
              p.isCoins
                ? `₹${p.denomination} in coins`
                : `${p.count} × ₹${p.denomination}`
            }
          />
        );
      })}
    </div>
  );
}

function DenomLegend({ pieces }: { pieces: DenomPiece[] }) {
  if (pieces.length === 0) return null;
  const parts = pieces.map((p, i) =>
    p.isCoins
      ? `₹${p.denomination} in coins`
      : `${p.count} × ₹${p.denomination}`
  );
  return (
    <p className="font-sans text-xs text-stone tabular mt-1.5">
      {parts.join(' + ')}
    </p>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ResultsSection({
  results,
  grandTotal,
  taxAmount,
  tipAmount,
  currency,
  onReset,
}: Props) {
  const hasResults = results.length > 0 && grandTotal > 0;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="space-y-4">
      {/* Section heading + Reset */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-gold text-base font-bold tracking-wide">
          Results
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="font-sans text-xs font-semibold text-stone border border-stone/30 bg-paper hover:bg-stone/10 px-3 py-2 rounded-[3px] transition-colors min-h-[44px]"
        >
          Reset
        </button>
      </div>

      {/* Placeholder state */}
      {!hasResults ? (
        <p className="font-serif italic text-stone text-sm text-center py-8">
          Enter a bill amount to see results.
        </p>
      ) : (
        <>
          {/* Summary chips: Grand Total / Tax / Tip */}
          <div className="flex gap-3 text-xs font-sans text-stone border border-stone/20 rounded-[3px] p-3 bg-paper/40">
            <div className="flex-1 text-center">
              <div className="font-sans font-bold text-ink tabular text-sm">
                {formatAmount(grandTotal, currency)}
              </div>
              <div className="uppercase tracking-wider text-[10px] mt-0.5">Grand Total</div>
            </div>
            {taxAmount > 0 && (
              <div className="flex-1 text-center border-l border-stone/20">
                <div className="font-sans font-bold text-ink tabular text-sm">
                  {formatAmount(taxAmount, currency)}
                </div>
                <div className="uppercase tracking-wider text-[10px] mt-0.5">Tax</div>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="flex-1 text-center border-l border-stone/20">
                <div className="font-sans font-bold text-ink tabular text-sm">
                  {formatAmount(tipAmount, currency)}
                </div>
                <div className="uppercase tracking-wider text-[10px] mt-0.5">Tip</div>
              </div>
            )}
          </div>

          {/* Per-person ledger rows */}
          <ul>
            {results.map((result) => {
              const isExpanded = expandedId === result.personId;
              const denomPieces =
                currency === 'INR' ? breakIntoNotes(result.total) : [];
              const denomTotal = Math.round(result.total);

              return (
                <li key={result.personId}>
                  {/* Main row */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(result.personId)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:rounded-[2px]"
                  >
                    {/* Name (serif) */}
                    <span
                      className="font-serif text-sm text-ink"
                      style={{ maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {result.name || 'Person'}
                    </span>
                    {/* Amount (sans, tabular) */}
                    <span className="font-sans text-sm font-bold text-ink tabular">
                      {formatAmount(result.total, currency)}
                    </span>
                  </button>

                  {/* Breakdown detail (tax / tip lines) */}
                  {(taxAmount > 0 || tipAmount > 0) && (
                    <div className="flex gap-4 pb-2 text-xs font-sans text-stone tabular">
                      <span>Subtotal {formatAmount(result.subtotal, currency)}</span>
                      {taxAmount > 0 && (
                        <span>Tax {formatAmount(result.taxShare, currency)}</span>
                      )}
                      {tipAmount > 0 && (
                        <span>Tip {formatAmount(result.tipShare, currency)}</span>
                      )}
                    </div>
                  )}

                  {/* Hand over panel */}
                  {isExpanded && currency === 'INR' && denomPieces.length > 0 && (
                    <div className="mb-3 p-3 border border-stone/20 rounded-[3px] bg-paper/60 space-y-2">
                      {/* Label */}
                      <p
                        className="font-sans text-[10px] font-bold text-gold uppercase tracking-[0.18em]"
                        style={{ fontVariant: 'small-caps' }}
                      >
                        Hand over
                      </p>
                      {/* Bar */}
                      <DenomBar pieces={denomPieces} total={denomTotal} />
                      {/* Legend */}
                      <DenomLegend pieces={denomPieces} />
                    </div>
                  )}

                  {/* Hairline divider between rows */}
                  <div className="border-t border-stone/20" />
                </li>
              );
            })}
          </ul>

          {/* Double rule + Grand total row */}
          <div className="double-rule mt-4" />
          <div className="flex justify-between items-center">
            <span className="font-serif text-sm font-bold text-ink">Total</span>
            <span className="font-sans text-xl font-bold tabular text-magenta">
              {formatAmount(grandTotal, currency)}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
