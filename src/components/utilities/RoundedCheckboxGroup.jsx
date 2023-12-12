import React, { useState } from "react";
import { useLayoutEffect } from "react";
import { useEffect } from "react";

const RoundedCheckboxGroup = ({ space }) => {
  const [selectedOption, setSelectedOption] = useState("Squatting");

  const options = [
    { label: "Sell Squatting space ", value: "Squatting" },
    { label: "Sell bedspace", value: "bedspace" },
  ];

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };
 

  return (
    <div className="flex flex-col">
      {options.map((option, idx) => (
        <label
          key={option.value}
          className="flex items-center space-x-2 cursor-pointer mb-2"
        >
          <input
            type="radio"
            name="rounded-checkbox"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={() => {
              handleOptionChange(option.value);
              if (space) {
                space(idx);
              }
            }}
            className="w-3 h-3 rounded-full border-[#54007B] text-[#54007B] checked:bg-[#54007B] appearance-none border "
          />

          <span className=" text-base text-[#1A0823] ">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RoundedCheckboxGroup;
