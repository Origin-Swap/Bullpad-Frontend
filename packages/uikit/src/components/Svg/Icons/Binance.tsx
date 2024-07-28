import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 96 96" {...props}>
      <image
        width="96"
        height="96"
        href="https://res.corex.network/token/CORE_0x40375C92d9FAf44d2f9db9Bd9ba41a3317a2404f.png"
      />
    </Svg>
  );
};

export default Icon;
