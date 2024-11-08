import * as React from "react";


const SVGComponent = (props) => (
  <svg
    width={800}
    height={800}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g />
    <path d="M26.664 4.82H5.336a2.13 2.13 0 0 0-2.132 2.133v13.868c0 1.178.955 2.133 2.132 2.133h14.968l4.226 4.226v-4.226h2.134a2.133 2.133 0 0 0 2.133-2.133V6.953a2.133 2.133 0 0 0-2.133-2.133m1.066 16.001c0 .588-.479 1.066-1.066 1.066h-3.2v2.718l-2.718-2.718H5.336a1.067 1.067 0 0 1-1.066-1.066V6.953c0-.588.479-1.066 1.066-1.066h21.328c.588 0 1.066.478 1.066 1.066z" />
    <path d="M16 12.824a1.066 1.066 0 1 0 0 2.133 1.066 1.066 0 0 0 0-2.133m4.265 0a1.066 1.066 0 1 0 0 2.133 1.066 1.066 0 0 0 0-2.133m-8.43 0a1.066 1.066 0 1 0 0 2.133 1.066 1.066 0 0 0 0-2.133" />
  </svg>
);
export default SVGComponent;
