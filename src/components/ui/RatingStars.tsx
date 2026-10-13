import React from 'react';
import { StarFilled, StarOutlined } from '@ant-design/icons';

interface RatingStarsProps {
  rating: number;
  count?: number;
  showText?: boolean;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  showText = true,
  size = 14,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-brand-peach">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < fullStars || (i === fullStars && hasHalf);
          return isFilled ? (
            <StarFilled
              key={i}
              className="text-brand-peach"
              style={{ fontSize: size }}
            />
          ) : (
            <StarOutlined
              key={i}
              className="text-stone-300"
              style={{ fontSize: size }}
            />
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-medium text-stone-600 ml-1">
          {rating.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  );
};
