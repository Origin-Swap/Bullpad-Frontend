import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth={3}
    stroke="#000"
    fill="none"
    {...props}
  >
    <path d="M32.94 57.93H10.41a3.07 3.07 0 0 1-3.07-3.06V9.13a3.07 3.07 0 0 1 3.07-3.06h21.21a3.07 3.07 0 0 1 3.07 3.06l-.12 9.34.08 16.26v4.42" />
    <path
      strokeLinecap="round"
      d="M16.02 10.34h6.08m-2.61 43.13h3.05m3.34-43.13h.13"
    />
    <path d="M7.34 49.36h26.54M7.34 14.75h27.35m21.88 43.18H32.94l.81-14.74a10.64 10.64 0 0 1 10.62-10h1.25a10.13 10.13 0 0 1 10.11 9.56Z" />
    <path d="m41.94 33.56-4.22-8a.27.27 0 0 1 .29-.4l2.55.42a25.2 25.2 0 0 0 8.13 0l2.81-.45a.27.27 0 0 1 .28.41l-4.63 7.77" />
    <path strokeLinecap="round" d="m44.75 29.92-.56 3.23" />
    <path d="M49.53 41.21a4.62 4.62 0 0 0-4.34-2.81c-3.91 0-4.06 2.81-4.06 2.81s-.59 3.45 4.2 3.82c5 .38 4.2 3.82 4.2 3.82a4.16 4.16 0 0 1-4.2 3.15c-3.69.19-4.84-3.69-4.84-3.69m4.7-12.39V54.9" />
  </Svg>
  );
};

export default Icon;
