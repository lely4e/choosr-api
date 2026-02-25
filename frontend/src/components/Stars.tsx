import React from "react";
import { Star } from "lucide-react";
import type { StarRatingProps } from "../utils/types";


const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 12,
  color = "#737791",
}) => {
    const safeRating = rating ?? 0

  return (
    <div style={{ display: "flex"}}>
      {Array.from({ length: totalStars }, (_, index) => {
        const starNumber = index + 1;

        // ⭐ Full Star
        if (safeRating >= starNumber) {
          return (
            <Star
              key={starNumber}
              size={size}
              strokeWidth={1.5}
              fill={color}
              color={color}
            />
          );
        }

        // ⭐ Half Star
        if (safeRating >= starNumber - 0.5) {
          return (
            <div
              key={starNumber}
              style={{
                position: "relative",
                width: size,
                height: size,
              }}
            >
              {/* Empty Star */}
              <Star
                size={size}
                strokeWidth={1.5}
                fill="none"
                color={color}
              />

              {/* Half Filled Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <Star
                  size={size}
                  strokeWidth={1.5}
                  fill={color}
                  color={color}
                />
              </div>
            </div>
          );
        }

        // ⭐ Empty Star
        return (
          <Star
            key={starNumber}
            size={size}
            strokeWidth={1.5}
            fill="none"
            color={color}
          />
        );
      })}
    </div>
  );
};

export default StarRating;