
import React from "react";

interface Props {
  placeholder?: string;
  onFocus?: () => void;
}

// 見た目に関するProps
interface StyleProps {
  size?: "sm" | "md" | "lg";
}

const getSizeClass = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "w-32";
    case "md":
      return "w-48";
    case "lg":
      return "w-64";
    default:
      return "w-48";
  }
}

export interface TextboxProps extends Props, StyleProps { }

export default function Textbox(props: TextboxProps) {
  const { placeholder, size = "md" } = props;

  const sizeClass = getSizeClass(size);
  return (
    <div>
      <input type="text" placeholder={placeholder} className={`border rounded-lg p-2 ${sizeClass}`}></input>
    </div>
  );
}
