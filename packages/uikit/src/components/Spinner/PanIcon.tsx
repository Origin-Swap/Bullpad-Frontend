import React from "react";
import Svg from "../Svg/Svg";
import { SvgProps } from "../Svg/types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 256 256" {...props}>
      <image width="256" height="256" href="/images/home/lunar-bunny/wallet-1.png" />
    </Svg>
  );
};

export default Icon;
