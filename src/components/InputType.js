import React from "react";
import "../styles/components/inputtype.scss";

export default function InputType({ props }) {
  return (
    <div className="input-wrapper">
      <input type="text" onChange={(e) => props.onChange(e, props.id)} />
    </div>
  );
}
