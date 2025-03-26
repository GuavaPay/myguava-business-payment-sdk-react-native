import { concatWords } from "./concatWords";

export const getQueryParams = (
  ...args: (string | number | boolean | null | undefined)[]
) => {
  const queryParams = concatWords(...args, { separator: "&" });
  return queryParams ? `?${queryParams}` : "";
};
