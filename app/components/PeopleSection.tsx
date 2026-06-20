'use client';

import React from 'react';
import { Person } from './types';

interface Props {
  people: Person[];
  onAddPerson: () => void;
  onRemovePerson: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
}

export default function PeopleSection({
  people,
  onAddPerson,
  onRemovePerson,
  onNameChange,
}: Props) {
  const canRemove = people.length > 2;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-gold text-base font-bold tracking-wide">
          People
        </h2>
        <button
          type="button"
          onClick={onAddPerson}
          className="font-sans text-xs font-semibold text-navy bg-gold hover:bg-[#b8851f] active:bg-[#a0731a] px-3 py-2 rounded-[3px] transition-colors min-h-[44px] min-w-[44px]"
        >
          + Add Person
        </button>
      </div>

      <ul className="space-y-2">
        {people.map((person, index) => (
          <li key={person.id} className="flex items-center gap-2">
            {/* Row number */}
            <span className="font-sans text-xs tabular text-stone w-5 text-right flex-shrink-0">
              {index + 1}
            </span>
            <input
              type="text"
              maxLength={50}
              aria-label={`Name for person ${index + 1}`}
              placeholder={`Person ${index + 1}`}
              value={person.name}
              onChange={(e) => onNameChange(person.id, e.target.value)}
              className="flex-1 font-serif text-sm text-ink bg-paper border border-stone/30 rounded-[3px] px-3 py-2.5 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold placeholder-stone/40"
            />
            <button
              type="button"
              aria-label={`Remove ${person.name || `Person ${index + 1}`}`}
              disabled={!canRemove}
              onClick={() => canRemove && onRemovePerson(person.id)}
              className={`rounded-[3px] p-2.5 font-sans text-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                canRemove
                  ? 'text-stone hover:text-red-600 hover:bg-stone/10'
                  : 'text-stone/25 cursor-not-allowed'
              }`}
            >
              {/* Trash icon */}
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
          </li>
        ))}
      </ul>
    </section>
  );
}
