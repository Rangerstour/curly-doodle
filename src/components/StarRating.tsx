import { Star } from 'lucide-react';

interface Props {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({ rating, size = 16, showValue = false, reviewCount }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400" style={{ width: size, height: size }} />
        ))}
        {hasHalf && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star className="absolute text-gray-300 fill-gray-300" style={{ width: size, height: size }} />
            <div className="absolute overflow-hidden" style={{ width: size / 2 }}>
              <Star className="text-yellow-400 fill-yellow-400" style={{ width: size, height: size }} />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300 fill-gray-300" style={{ width: size, height: size }} />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && <span className="text-gray-400"> ({reviewCount} reviews)</span>}
        </span>
      )}
    </div>
  );
}
