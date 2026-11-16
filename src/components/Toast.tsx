import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up pointer-events-none">
      <div className="flex items-center space-x-2.5 bg-neutral-950 text-white px-4 py-3 rounded-full shadow-2xl border border-neutral-800 text-xs font-medium tracking-wide">
        {toastMessage.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : (
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
        )}
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
};
