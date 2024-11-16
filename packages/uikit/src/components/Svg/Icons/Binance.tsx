import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 96 96" {...props}>
      <image
        width="96"
        height="96"
        href="https://s3.coinmarketcap.com/static-gravity/image/fd7a43cc620c4ade96804bb1c36aac6f.png"
      />
    </Svg>
  );
};

export default Icon;
