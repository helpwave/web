import { tw } from "@helpwave/common/twind/index";
import { useState } from "react";

type SelectProps = {
  label: string;
  value: string;
  options: string[];
};

export const Select = ({ label, value, options }: SelectProps) => {
  const [selected, setSelected] = useState<string>(value);

  const handleChange = (value: string) => {
    setSelected(value);
  };

  return (
    <div className={tw("flex flex-col mx-2")}>
      <label className={tw("text-sm font-bold mb-3 text-slate-700")}>
        {label}
      </label>
      <select
        className={tw("border border-gray-300 rounded-md")}
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
