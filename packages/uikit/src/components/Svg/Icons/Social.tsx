import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg
    id="Icons"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    {...props}
  >
    <circle className="st0" cx={6} cy={26} r={4} />
    <path
      className="st0"
      d="M2 7.5c1.2-.3 2.5-.4 3.8-.4 10.5 0 19.1 8.5 19.1 19.1 0 1.3-.1 2.6-.4 3.8h5.1c.2-1.2.3-2.5.3-3.8C30 12.8 19.2 2 5.8 2c-1.3 0-2.6.1-3.8.3z"
    />
    <path
      className="st0"
      d="M2 18q1.8-.9 3.9-.9c5 0 9 4 9 9q0 2.1-.9 3.9h5.5c.3-1.2.5-2.5.5-3.9C20 18.3 13.7 12 5.9 12c-1.3 0-2.6.2-3.9.5z"
    />
  </Svg>
);

export default Icon;
