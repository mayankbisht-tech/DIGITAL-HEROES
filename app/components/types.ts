export type Currency = 'INR' | 'USD' | 'EUR';
export type TipMode = 'percent' | 'flat';
export type SplitMode = 'equal' | 'itemized';

export interface Person {
  id: string;
  name: string;
}

export interface LineItem {
  id: string;
  name: string;
  amount: string; // string so empty input is allowed
  taggedPersonIds: string[];
}

export interface PersonResult {
  personId: string;
  name: string;
  subtotal: number;
  taxShare: number;
  tipShare: number;
  total: number;
}

export interface BillState {
  currency: Currency;
  billAmount: string;
  taxPercent: string;
  tipMode: TipMode;
  tipValue: string;
  splitMode: SplitMode;
  people: Person[];
  lineItems: LineItem[];
}
