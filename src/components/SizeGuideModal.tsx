import React, { useState } from 'react';
import { X, Ruler, Footprints } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const SIZE_CHART = [
  { eu: 38, usM: 5.5, usW: 7.0, uk: 5.0, cm: 24.0, inches: 9.4 },
  { eu: 39, usM: 6.5, usW: 8.0, uk: 6.0, cm: 24.7, inches: 9.7 },
  { eu: 40, usM: 7.5, usW: 9.0, uk: 6.5, cm: 25.3, inches: 10.0 },
  { eu: 41, usM: 8.0, usW: 9.5, uk: 7.5, cm: 26.0, inches: 10.2 },
  { eu: 42, usM: 9.0, usW: 10.5, uk: 8.5, cm: 26.7, inches: 10.5 },
  { eu: 43, usM: 10.0, usW: 11.5, uk: 9.5, cm: 27.3, inches: 10.7 },
  { eu: 44, usM: 10.5, usW: 12.0, uk: 10.0, cm: 28.0, inches: 11.0 },
  { eu: 45, usM: 11.5, usW: 13.0, uk: 11.0, cm: 28.7, inches: 11.3 },
  { eu: 46, usM: 12.5, usW: 14.0, uk: 12.0, cm: 29.3, inches: 11.5 },
];

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [unitMetric, setUnitMetric] = useState<'cm' | 'inches'>('cm');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center space-x-2">
            <Ruler className="w-4 h-4 text-neutral-900" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-950">
              International Footwear Sizing & Conversions
            </h3>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6">
          
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-600">
              All VELOCE silhouettes are sculpted using classical Italian anatomical lasts.
            </p>
            <div className="flex items-center space-x-1 border border-stone-300 rounded-full p-0.5 bg-stone-100 text-xs">
              <button
                onClick={() => setUnitMetric('cm')}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  unitMetric === 'cm' ? 'bg-neutral-950 text-white' : 'text-neutral-600'
                }`}
              >
                Centimeters
              </button>
              <button
                onClick={() => setUnitMetric('inches')}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  unitMetric === 'inches' ? 'bg-neutral-950 text-white' : 'text-neutral-600'
                }`}
              >
                Inches
              </button>
            </div>
          </div>

          {/* Size Conversion Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 font-mono text-[11px] text-neutral-700 uppercase tracking-wider">
                  <th className="py-2.5 px-3">EU</th>
                  <th className="py-2.5 px-3">US Men</th>
                  <th className="py-2.5 px-3">US Women</th>
                  <th className="py-2.5 px-3">UK</th>
                  <th className="py-2.5 px-3">Foot Length ({unitMetric})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-neutral-800">
                {SIZE_CHART.map(row => (
                  <tr key={row.eu} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2 px-3 font-bold font-mono text-neutral-950">{row.eu}</td>
                    <td className="py-2 px-3">{row.usM}</td>
                    <td className="py-2 px-3">{row.usW}</td>
                    <td className="py-2 px-3">{row.uk}</td>
                    <td className="py-2 px-3 font-mono text-neutral-600">
                      {unitMetric === 'cm' ? `${row.cm} cm` : `${row.inches}"`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure at Home */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-950 flex items-center space-x-1.5">
              <Footprints className="w-4 h-4 text-neutral-900" />
              <span>How To Measure Your Exact Foot Length</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600">
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-mono font-bold text-neutral-900 block mb-1">01. Setup</span>
                Stand barefoot with your heel against a flat wall, resting your foot on a blank sheet of paper.
              </div>
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-mono font-bold text-neutral-900 block mb-1">02. Mark</span>
                With a pencil held strictly upright, draw a line directly in front of your longest toe.
              </div>
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-mono font-bold text-neutral-900 block mb-1">03. Compare</span>
                Measure the distance from the paper edge to the mark and match to our table above.
              </div>
            </div>
          </div>

          {/* Silhouette fit advice */}
          <div className="text-[11px] text-neutral-500 space-y-1">
            <p>
              • <strong className="text-neutral-800">Between sizes?</strong> If you wear a half size in sneakers, we recommend sizing down for our Italian Nappa models (they will mold to your foot) and sizing up for technical racing runners.
            </p>
            <p>
              • <strong className="text-neutral-800">Complimentary exchange guarantee:</strong> If the size isn't 100% ideal, we deliver an exchange pair with prepaid return labels at zero cost.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="bg-neutral-950 text-white text-xs font-semibold uppercase tracking-widest px-6 py-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};
