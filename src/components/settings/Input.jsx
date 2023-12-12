import { useEffect, useState } from "react";

const SettingsInput = ({ title, placeholder, change, value }) => {
  const [text, settext] = useState(value);
  console.log(value)
  useEffect(() => {
    change(text);
  }, [text]);
  

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mt-4">
      <div className="sm:col-span-2">
        <label className="block text-sm leading-6 color-text">
          {title || "Name"}
        </label>

        <div className="mt-2.5">
          <input
            type="text"
            placeholder={placeholder || "John Doe"}
            value={value}
            onChange={(e) => settext(e.target.value)}
            className="block w-full px-3.5 py-2 color-text settings-input-input  placeholder:color-text sm:text-sm sm:leading-6 rounded-2xl outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsInput;
