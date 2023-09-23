import React from "react";

const ShimmerCard = () => {
  return (
    <div>
      <div
        className="
      space-y-5
      rounded-2xl
      bg-white/5
      p-4
      bg-gradient-to-r
      from-transparent
      via-gray-400/10
      to-transparent
      isolate
      overflow-hidden
      shadow-xl shadow-black/5
      before:border-t before:border-gray-400/10
      shimmer-text
      ">
        <div className="h-24 rounded-lg bg-gray-400/10"></div>
        <div className="space-y-3">
          <div className="h-3 w-3/5 rounded-lg bg-gray-400/10"></div>
          <div className="h-3 w-4/5 rounded-lg bg-gray-400/20"></div>
          <div className="h-3 w-2/5 rounded-lg bg-gray-400/20"></div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerCard;
