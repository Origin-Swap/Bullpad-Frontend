import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    xmlSpace="preserve"
    {...props}
  >
    <path
      fill="none"
      stroke="#000"
      strokeWidth={2}
      strokeLinejoin="bevel"
      strokeMiterlimit={10}
      d="m51.083 10-9-9-9 9"
    />
    <path
      fill="none"
      stroke="#000"
      strokeWidth={2}
      strokeMiterlimit={10}
      d="M42.083 1 42 55"
    />
    <path
      fill="none"
      stroke="#000"
      strokeWidth={2}
      strokeLinejoin="bevel"
      strokeMiterlimit={10}
      d="m13.083 54 9 9 9-9"
    />
    <path
      fill="none"
      stroke="#000"
      strokeWidth={2}
      strokeMiterlimit={10}
      d="M22.083 63 22 9"
    />
  </Svg>
  );
};

export default Icon;
