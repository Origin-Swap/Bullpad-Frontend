import React from "react";
import Svg from "../Svg/Svg";
import { SvgProps } from "../Svg/types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 128 128" {...props}>
      <image width="128" height="128" href="/images/home/lunar-bunny/coin.png" />
    </Svg>
  );
};

export default Icon;
