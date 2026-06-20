import { BillState, PersonResult } from './types';

/** Round a number to 2 decimal places using standard rounding. */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Compute per-person results from the current bill state.
 * Guarantees: sum of all PersonResult.total === grandTotal (within floating point).
 */
export function compute(state: BillState): {
  results: PersonResult[];
  grandTotal: number;
  taxAmount: number;
  tipAmount: number;
  subtotalSum: number;
} {
  const bill = Math.max(0, parseFloat(state.billAmount) || 0);
  const taxPercent = Math.max(0, parseFloat(state.taxPercent) || 0);
  const tipVal = Math.max(0, parseFloat(state.tipValue) || 0);

  const taxAmount = round2(bill * (taxPercent / 100));
  const tipAmount =
    state.tipMode === 'percent' ? round2(bill * (tipVal / 100)) : round2(tipVal);

  const grandTotal = round2(bill + taxAmount + tipAmount);

  const { people, lineItems, splitMode } = state;

  if (people.length === 0) {
    return { results: [], grandTotal, taxAmount, tipAmount, subtotalSum: 0 };
  }

  // Build per-person subtotals
  const subtotalMap: Record<string, number> = {};
  for (const p of people) {
    subtotalMap[p.id] = 0;
  }

  if (splitMode === 'equal') {
    // Each person's subtotal is an equal share of the bill
    const equalShare = bill / people.length;
    for (const p of people) {
      subtotalMap[p.id] = equalShare;
    }
  } else {
    // Itemized: assign each line item's cost to tagged people
    for (const item of lineItems) {
      const itemAmount = Math.max(0, parseFloat(item.amount) || 0);
      const tagged = item.taggedPersonIds.filter((id) =>
        people.some((p) => p.id === id)
      );
      if (tagged.length === 0) continue;
      const perPerson = itemAmount / tagged.length;
      for (const id of tagged) {
        if (subtotalMap[id] !== undefined) {
          subtotalMap[id] += perPerson;
        }
      }
    }
  }

  const subtotalSum = Object.values(subtotalMap).reduce((a, b) => a + b, 0);

  // Build results with proportional tax + tip
  const rawResults: PersonResult[] = people.map((p) => {
    const subtotal = subtotalMap[p.id] ?? 0;
    let taxShare = 0;
    let tipShare = 0;

    if (subtotalSum > 0) {
      const ratio = subtotal / subtotalSum;
      taxShare = round2(ratio * taxAmount);
      tipShare = round2(ratio * tipAmount);
    } else if (people.length > 0) {
      // Zero-sum case: distribute equally
      taxShare = round2(taxAmount / people.length);
      tipShare = round2(tipAmount / people.length);
    }

    return {
      personId: p.id,
      name: p.name,
      subtotal: round2(subtotal),
      taxShare,
      tipShare,
      total: round2(subtotal + taxShare + tipShare),
    };
  });

  // Reconciliation: fix rounding drift so sum === grandTotal
  const sumOfTotals = rawResults.reduce((acc, r) => acc + r.total, 0);
  const diff = round2(grandTotal - round2(sumOfTotals));

  if (diff !== 0 && rawResults.length > 0) {
    rawResults[0] = {
      ...rawResults[0],
      total: round2(rawResults[0].total + diff),
    };
  }

  return { results: rawResults, grandTotal, taxAmount, tipAmount, subtotalSum };
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

export function formatAmount(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol}${amount.toFixed(2)}`;
}
