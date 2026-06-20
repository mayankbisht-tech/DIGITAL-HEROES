'use client';

import React, { useState, useCallback } from 'react';
import { BillState, Currency, LineItem, Person, SplitMode, TipMode } from './types';
import { compute } from './calculator';
import BillInputSection from './BillInputSection';
import PeopleSection from './PeopleSection';
import ItemizedSection from './ItemizedSection';
import ResultsSection from './ResultsSection';

function makeId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function defaultPeople(): Person[] {
  return [
    { id: makeId(), name: 'Person 1' },
    { id: makeId(), name: 'Person 2' },
  ];
}

function defaultState(): BillState {
  const people = defaultPeople();
  return {
    currency: 'INR',
    billAmount: '',
    taxPercent: '',
    tipMode: 'percent',
    tipValue: '',
    splitMode: 'equal',
    people,
    lineItems: [],
  };
}

export default function SplitCalculator() {
  const [state, setState] = useState<BillState>(defaultState);

  const update = useCallback((patch: Partial<BillState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // --- People handlers ---
  const handleAddPerson = useCallback(() => {
    setState((prev) => {
      const newPerson: Person = {
        id: makeId(),
        name: `Person ${prev.people.length + 1}`,
      };
      return { ...prev, people: [...prev.people, newPerson] };
    });
  }, []);

  const handleRemovePerson = useCallback((id: string) => {
    setState((prev) => {
      if (prev.people.length <= 2) return prev;
      const people = prev.people.filter((p) => p.id !== id);
      const lineItems = prev.lineItems.map((item) => ({
        ...item,
        taggedPersonIds: item.taggedPersonIds.filter((pid) => pid !== id),
      }));
      return { ...prev, people, lineItems };
    });
  }, []);

  const handleNameChange = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === id ? { ...p, name } : p)),
    }));
  }, []);

  // --- Split mode ---
  const handleSplitModeChange = useCallback(
    (mode: SplitMode) => {
      if (mode === state.splitMode) return;
      if (
        state.splitMode === 'itemized' &&
        mode === 'equal' &&
        state.lineItems.length > 0
      ) {
        const confirmed = window.confirm(
          'Switching to Equal Split will discard your line items. Continue?'
        );
        if (!confirmed) return;
      }
      setState((prev) => ({
        ...prev,
        splitMode: mode,
        lineItems: mode === 'equal' ? [] : prev.lineItems,
      }));
    },
    [state.splitMode, state.lineItems.length]
  );

  // --- Line item handlers ---
  const handleAddItem = useCallback(() => {
    setState((prev) => {
      const newItem: LineItem = {
        id: makeId(),
        name: '',
        amount: '',
        taggedPersonIds: prev.people.map((p) => p.id),
      };
      return { ...prev, lineItems: [...prev.lineItems, newItem] };
    });
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
  }, []);

  const handleItemNameChange = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, name } : item
      ),
    }));
  }, []);

  const handleItemAmountChange = useCallback((id: string, amount: string) => {
    setState((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, amount } : item
      ),
    }));
  }, []);

  const handleToggleTag = useCallback((itemId: string, personId: string) => {
    setState((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id !== itemId) return item;
        const tagged = item.taggedPersonIds.includes(personId);
        return {
          ...item,
          taggedPersonIds: tagged
            ? item.taggedPersonIds.filter((id) => id !== personId)
            : [...item.taggedPersonIds, personId],
        };
      }),
    }));
  }, []);

  // --- Reset ---
  const handleReset = useCallback(() => {
    setState(defaultState());
  }, []);

  // --- Compute ---
  const { results, grandTotal, taxAmount, tipAmount } = compute(state);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1A17' }}>
      {/* ── Header ── */}
      <header className="bg-[#1C1A17] border-b border-[#3a3630] py-6">
        <div className="max-w-[560px] mx-auto px-5">
          {/* Brand name */}
          <h1
            className="font-serif text-gold tracking-[0.22em] uppercase text-xl font-bold"
            style={{ fontVariant: 'small-caps' }}
          >
            Khata
          </h1>
          {/* Tagline — lighter warm tone for readability on charcoal */}
          <p className="font-serif italic text-sm mt-0.5" style={{ color: '#CBB99A' }}>
            who owes what, settled fair
          </p>
        </div>
      </header>

      {/* ── Split mode toggle ── */}
      <div className="max-w-[560px] mx-auto px-5 pt-5">
        {/* Paper-cream container so inactive tab text is always readable */}
        <div className="flex rounded-[5px] overflow-hidden border border-stone/40" style={{ backgroundColor: '#F4ECDA' }}>
          {(['equal', 'itemized'] as SplitMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleSplitModeChange(mode)}
              className={`flex-1 py-3 text-sm font-sans font-semibold transition-colors ${
                state.splitMode === mode
                  ? 'text-ink'
                  : 'text-ink/60 hover:text-ink'
              }`}
              style={state.splitMode === mode ? { backgroundColor: '#C9962B' } : { backgroundColor: 'transparent' }}
            >
              {mode === 'equal' ? 'Equal Split' : 'Itemized Split'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main ledger card ── */}
      <main className="max-w-[560px] mx-auto px-5 py-5 space-y-0">
        {/* Single ledger card wrapping all sections */}
        <div
          className="ledger-card bg-paper rounded-[5px] shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
          style={{ paddingLeft: '52px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px' }}
        >
          {/* Bill Details */}
          <BillInputSection
            currency={state.currency}
            billAmount={state.billAmount}
            taxPercent={state.taxPercent}
            tipMode={state.tipMode}
            tipValue={state.tipValue}
            onCurrencyChange={(v: Currency) => update({ currency: v })}
            onBillAmountChange={(v: string) => update({ billAmount: v })}
            onTaxPercentChange={(v: string) => update({ taxPercent: v })}
            onTipModeChange={(v: TipMode) => update({ tipMode: v })}
            onTipValueChange={(v: string) => update({ tipValue: v })}
          />

          {/* Hairline divider */}
          <div className="border-t border-stone/25 my-5" />

          {/* People */}
          <PeopleSection
            people={state.people}
            onAddPerson={handleAddPerson}
            onRemovePerson={handleRemovePerson}
            onNameChange={handleNameChange}
          />

          {/* Itemized section */}
          {state.splitMode === 'itemized' && (
            <>
              <div className="border-t border-stone/25 my-5" />
              <ItemizedSection
                lineItems={state.lineItems}
                people={state.people}
                currency={state.currency}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onItemNameChange={handleItemNameChange}
                onItemAmountChange={handleItemAmountChange}
                onToggleTag={handleToggleTag}
              />
            </>
          )}

          {/* Results */}
          <div className="border-t border-stone/25 my-5" />
          <ResultsSection
            results={results}
            grandTotal={grandTotal}
            taxAmount={taxAmount}
            tipAmount={tipAmount}
            currency={state.currency}
            onReset={handleReset}
          />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="max-w-[560px] mx-auto px-5 py-8 flex flex-col items-center gap-4 text-center">
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans font-semibold text-sm text-navy bg-gold hover:bg-[#b8851f] active:bg-[#a0731a] px-5 py-3 rounded-[4px] transition-colors min-h-[44px] underline-offset-4"
        >
          Built for Digital Heroes
        </a>
        <div className="font-sans text-xs text-stone space-y-0.5">
          <p>Mayank Bisht</p>
          <p>mayankbisht1107@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}
