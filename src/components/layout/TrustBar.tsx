import React from 'react';
import { Truck, Shield, Award, Wrench } from 'lucide-react';
import { useTrustBar } from '~/features/home/hooks/useBanner';
import type { TrustBarIconName } from '~/mock/trustbar/mock-trustbar';

const ICON_MAP: Record<TrustBarIconName, React.ReactNode> = {
  truck:  <Truck  size={20} />,
  shield: <Shield size={20} />,
  award:  <Award  size={20} />,
  wrench: <Wrench size={20} />,
};

export const TrustBar: React.FC = () => {
  const { trustBarItems } = useTrustBar();
  return (
    <div className="bg-amber-950 border-b border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
          {trustBarItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-800/60 border border-amber-700/40 flex items-center justify-center text-amber-300 shrink-0">
                {ICON_MAP[item.iconName]}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold leading-tight truncate">{item.title}</p>
                <p className="text-amber-300/70 text-[10px] leading-tight truncate">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
