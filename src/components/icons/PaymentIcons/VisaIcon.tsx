import React from "react";
import { SvgXml } from "react-native-svg";

const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="12" fill="none" viewBox="0 0 33 12">
    <path fill="#172B85" fill-rule="evenodd"
      d="M8.334 11.144H5.587l-2.06-8.087c-.097-.372-.304-.701-.61-.856A8.764 8.764 0 0 0 .4 1.345v-.312h4.424c.61 0 1.069.468 1.145 1.011l1.068 5.834 2.745-6.845h2.67zm5.645 0h-2.594l2.136-10.11h2.594zm5.491-7.31c.077-.544.534-.856 1.069-.856a4.713 4.713 0 0 1 2.517.467l.458-2.177A6.4 6.4 0 0 0 21.149.8C18.632.8 16.8 2.2 16.8 4.144c0 1.48 1.298 2.256 2.214 2.723.99.467 1.372.778 1.296 1.244 0 .7-.763 1.011-1.525 1.011-.916 0-1.832-.233-2.67-.622l-.458 2.178c.916.388 1.906.545 2.822.545 2.823.076 4.577-1.323 4.577-3.423 0-2.645-3.586-2.8-3.586-3.966m12.663 7.31-2.06-10.11h-2.211a1.15 1.15 0 0 0-1.069.777l-3.813 9.333h2.67l.533-1.477h3.28l.305 1.477zm-3.89-7.388.762 3.81H26.87z"
      clip-rule="evenodd" />
  </svg>
`;

export const VisaIcon = () => <SvgXml xml={xml} width="100%" height="100%" />;
