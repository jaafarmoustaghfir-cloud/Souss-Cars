import React from 'react';
import { Car } from 'lucide-react';

interface VehicleImagePlaceholderProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  text?: string;
  subtext?: string;
  showText?: boolean;
}

export const VehicleImagePlaceholder: React.FC<VehicleImagePlaceholderProps> = ({
  className = '',
  iconSize = 'md',
  text = 'Photo à venir',
  subtext,
  showText = true,
}) => {
  const iconClass =
    iconSize === 'sm'
      ? 'w-4 h-4 text-zinc-500 stroke-[1.75]'
      : iconSize === 'lg'
      ? 'w-14 h-14 text-zinc-500 stroke-[1.25]'
      : 'w-8 h-8 text-zinc-500 stroke-[1.5]';

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1c1c1c] to-[#121212] select-none p-4 text-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-inner flex items-center justify-center text-zinc-400">
          <Car className={iconClass} />
        </div>
        {showText && (
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-zinc-400 block tracking-wide">
              {text}
            </span>
            {subtext ? (
              <span className="text-[10px] text-zinc-600 block">{subtext}</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
