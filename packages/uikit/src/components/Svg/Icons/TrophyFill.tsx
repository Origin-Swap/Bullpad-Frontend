import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 18 20" {...props}>
  <image
    width="18"
    height="20"
    href="https://i.ibb.co/hsG7Sp6/Illustration.png"
  />
  </Svg>
);

export default Icon;
