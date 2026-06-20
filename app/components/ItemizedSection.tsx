'use client';

import React from 'react';
import { LineItem, Person, Currency } from './types';
import { formatAmount } from './calculator';

interface Props {
  lineItems: LineItem[];
  people: Person[];
  currency: Currency;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onItemNameChange: (id: string, name: string) => void;
  onItemAmountChange: (id: string, amount: string) => void;
  onToggleTag: (itemId: string, personId: string) => void;
}

export default function ItemizedSection({
  lineItems,
  people,
  currency,
  onAddItem,
  onRemoveItem,
  onItemNameChange,
  onItemAmountChange,
  onToggleTag,
}: Props) {
  const itemsTotal = lineItems.reduce(
    (sum, item) => sum + Math.max(0, parseFloat(item.amount) || 0),
    0
  );

  const inputClass =
    'w-full bg-paper border border-stone/30 rounded-[3px] px-3 py-2 text-sm font-sans text-ink tabular placeholder-stone/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold';

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-gold text-base font-bold tracking-wide">
          Line Items
        </h2>
        <button
          type="button"
          onClick={onAddItem}
          className="font-sans text-xs font-semibold text-navy bg-gold hover:bg-[#b8851f] active:bg-[#a0731a] px-3 py-2 rounded-[3px] transition-colors min-h-[44px] min-w-[44px]"
        >
          + Add Item
        </button>
      </div>

      {lineItems.length === 0 && (
        <p className="text-xs text-stone italic text-center py-3">
          No items yet — click &ldquo;Add Item&rdquo; to get started.
        </p>
      )}

      <ul className="space-y-4">
        {lineItems.map((item, index) => {
          const hasNoTags = item.taggedPersonIds.length === 0;
          return (
            <li
              key={item.id}
              className="border border-stone/30 rounded-[3px] p-3 space-y-3 bg-navy/10"
            >
              {/* Name + Amount + Remove */}
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    aria-label={`Item ${index + 1} name`}
                    placeholder={`Item ${index + 1}`}
                    value={item.name}
                    onChange={(e) => onItemNameChange(item.id, e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    aria-label={`Item ${index + 1} amount`}
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) => onItemAmountChange(item.id, e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Remove item ${index + 1}`}
                  onClick={() => onRemoveItem(item.id)}
                  className="rounded-[3px] p-2.5 text-stone hover:text-red-600 hover:bg-stone/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center mt-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                  </svg>
                </button>
              </div>

              {/* Person tag pills */}
              <div className="space-y-1.5">
                <p className="text-xs font-sans font-semibold text-stone uppercase tracking-widest">
                  Shared by
                </p>
                <div className="flex flex-wrap gap-2">
                  {people.map((person) => {
                    const tagged = item.taggedPersonIds.includes(person.id);
                    return (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => onToggleTag(item.id, person.id)}
                        aria-pressed={tagged}
                        className={`rounded-full px-3 py-1 text-xs font-sans font-medium transition-colors min-h-[32px] ${
                          tagged
                            ? 'bg-gold text-navy'
                            : 'bg-paper border border-stone/30 text-stone hover:border-gold hover:text-ink'
                        }`}
                      >
                        {person.name || 'Person'}
                      </button>
                    );
                  })}
                </div>
                {hasNoTags && (
                  <p className="text-xs text-red-600 mt-1">
                    Tag at least one person to this item.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Running total */}
      {lineItems.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t border-stone/25">
          <span className="text-xs font-sans font-semibold text-stone uppercase tracking-widest">
            Items Total
          </span>
          <span className="font-sans text-sm font-bold text-ink tabular">
            {formatAmount(itemsTotal, currency)}
          </span>
        </div>
      )}
    </section>
  );
}
