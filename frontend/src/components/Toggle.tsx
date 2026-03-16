import { useState } from "react";

type ToggleProps = {
  label?: string;
  initial?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function Toggle({ label, initial = true, onChange }: ToggleProps) {
  const [checked, setChecked] = useState(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
      {label && <span>{label}</span>}
      <div style={{ position: "relative", width: "50px", height: "26px" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          style={{
            opacity: 0,
            width: "100%",
            height: "100%",
            margin: 0,
            position: "absolute",
            cursor: "pointer",
          }}
        />
        {/* Track */}
        <div
          style={{
            background: checked ? "#f97316" : "#B0B6CC",
            borderRadius: "9999px",
            width: "100%",
            height: "100%",
            transition: "background 0.3s",
          }}
        />
        {/* Thumb */}
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "26px" : "2px",
            width: "22px",
            height: "22px",
            background: "#fff",
            borderRadius: "50%",
            transition: "left 0.3s",
          }}
        />
      </div>
    </label>
  );
}