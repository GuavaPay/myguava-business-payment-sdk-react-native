import React from "react";
import { SvgXml } from "react-native-svg";

const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="m2 5.83 2.83 2.83L10.5 3"
    />
  </svg>
`;

export const CheckIcon = ({ color = "#000" }: { color?: string }) => (
  <SvgXml xml={xml} width="100%" height="100%" color={color} />
);
