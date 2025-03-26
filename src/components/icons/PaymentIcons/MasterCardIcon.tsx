import React from "react";
import { SvgXml } from "react-native-svg";

const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="19" fill="none" viewBox="0 0 30 19">
    <path fill="#ED0006" fill-rule="evenodd"
      d="M14.905 16.44a9.069 9.069 0 0 1-5.864 2.134c-4.993 0-9.041-4-9.041-8.934C0 4.707 4.048.707 9.04.707a9.07 9.07 0 0 1 5.865 2.134A9.07 9.07 0 0 1 20.77.707c4.993 0 9.04 4 9.04 8.933 0 4.934-4.047 8.934-9.04 8.934a9.07 9.07 0 0 1-5.865-2.134"
      clip-rule="evenodd" />
    <path fill="#F9A000" fill-rule="evenodd"
      d="M14.905 16.44a8.87 8.87 0 0 0 3.177-6.8 8.87 8.87 0 0 0-3.177-6.799A9.07 9.07 0 0 1 20.77.707c4.993 0 9.04 4 9.04 8.933 0 4.934-4.047 8.934-9.04 8.934a9.07 9.07 0 0 1-5.865-2.134"
      clip-rule="evenodd" />
    <path fill="#FF5E00" fill-rule="evenodd"
      d="M14.905 16.44a8.87 8.87 0 0 0 3.177-6.8 8.87 8.87 0 0 0-3.177-6.8 8.87 8.87 0 0 0-3.176 6.8 8.87 8.87 0 0 0 3.176 6.8"
      clip-rule="evenodd" />
  </svg>
`;

export const MasterCardIcon = () => (
  <SvgXml xml={xml} width="100%" height="100%" />
);
