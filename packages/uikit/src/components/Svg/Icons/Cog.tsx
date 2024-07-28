import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
    <path
    d="M2 0v3h1V0zm7 0v12h1V0zm7 0v3h1V0zM0 4v3h5V4zm14 0v3h5V4zM1 5h3v1H1zm14 0h3v1h-3zM2 8v12h1V8zm14 0v12h1V8zm-9 5v3h5v-3zm1 1h3v1H8zm1 3v3h1v-3z"
    style={{
      fill: "#222",
      fillOpacity: 1,
      stroke: "none",
      strokeWidth: 0,
    }}
  />
    </Svg>
  );
};

export default Icon;
