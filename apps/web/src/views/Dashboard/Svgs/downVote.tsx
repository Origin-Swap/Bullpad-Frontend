import * as React from "react";


const SVGComponent = (props) => (
  <svg
    width={800}
    height={800}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="#000"
    strokeLinecap="round"
    {...props}
  >
    <path d="m21 10-9 11-9-11h5V2h8v8z" />
  </svg>
);
export default SVGComponent;
