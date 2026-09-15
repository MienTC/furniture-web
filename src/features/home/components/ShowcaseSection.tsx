import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { IFShowcaseSection } from '~/mock/banners/mock-banners';

export const ShowcaseSection: React.FC<{ showcase: IFShowcaseSection }> = ({ showcase }) => (
  <section className="max-w-7xl mx-auto px-4">
    <div className="bg-stone-900 rounded-3xl overflow-hidden border border-amber-900/30 text-white grid grid-cols-1 lg:grid-cols-2 items-center">
      <div className="p-8 sm:p-14 space-y-6">
        <div className="flex flex-wrap gap-2">
          {showcase.badges.map(b => (
            <span key={b.id} className={`${b.colorClass} text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide`}>{b.label}</span>
          ))}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold leading-snug">{showcase.title}</h2>
        <p className="text-stone-300 text-sm leading-relaxed font-light">{showcase.description}</p>
        <div className="flex flex-wrap gap-2">
          {showcase.highlights.map(hl => (
            <span key={hl} className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-stone-200 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              <CheckCircle2 size={13} className="text-amber-400 shrink-0" />{hl}
            </span>
          ))}
        </div>
        <Link to={showcase.ctaLink} className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-full text-xs inline-flex items-center gap-2 transition-colors">
          {showcase.ctaLabel} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="relative h-80 lg:h-full min-h-[350px]">
        <img src={showcase.imageUrl} alt="Showroom LuxDecor" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  </section>
);
