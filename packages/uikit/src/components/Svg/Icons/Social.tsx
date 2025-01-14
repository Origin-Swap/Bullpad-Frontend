import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg
      id="icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m6.45 17.216 7.981-3.845 2.98-7.115-7.116 2.98zm6.741-4.358-4.599 2.216 2.216-4.6zM12 1.2A10.8 10.8 0 1 0 22.8 12 10.81 10.81 0 0 0 12 1.2m0 20.6a9.8 9.8 0 1 1 9.8-9.8 9.81 9.81 0 0 1-9.8 9.8" />
      <path fill="none" d="M0 0h24v24H0z" />
    </Svg>
);

export default Icon;
