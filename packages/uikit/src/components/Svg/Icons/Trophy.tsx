import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 19 17" {...props}>
  <image
    width="19"
    height="17"
    href="https://i.ibb.co/hsG7Sp6/Illustration.png"
  />
  </Svg>
);

export default Icon;
