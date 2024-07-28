import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 15 15" fill="none" {...props}>
      <path d="M0.5 0V14.5H15M8.5 0V3.5M3.5 9.5V12M3.5 4V5.5M13.5 4V6.5M13.5 10.5V13M2.5 5.5H4.5V9.5H2.5V5.5ZM7.5 3.5H9.5V7.5H7.5V3.5ZM12.5 6.5H14.5V10.5H12.5V6.5Z" stroke="#000000"/>
    </Svg>
  );
};

export default Icon;
