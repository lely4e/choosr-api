import React from "react";
import type { AgeSliderProps } from "../utils/types";

const AgeSlider: React.FC<AgeSliderProps> = ({ value, onChange }) => {

  return (
    <div className="w-auto mt-10 text-center" >
      <label htmlFor="ageSlider" className="">
        Age: <strong>{value}</strong>
      </label>
      <input
        type="range"
        id="ageSlider"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[#ccd0de] rounded-lg appearance-none 
                   cursor-pointer accent-[#F25E0D]
                   hover:accent-[#F25E0D]focus:outline-none"
      />
    </div>
  );
};

export default AgeSlider;