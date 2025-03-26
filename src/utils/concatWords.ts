type ConcatWordType = string | number | boolean | undefined | null;
type ConcatWordsOptions = { separator: string };
type ConcatWordsArgs = [
  ...words: ConcatWordType[],
  separator: ConcatWordType | ConcatWordsOptions,
];

interface ConcatWords {
  (...args: ConcatWordsArgs): string;
  (words: ConcatWordsArgs): string;
}

export const concatWords: ConcatWords = (...args) => {
  const flattenedArgs = args.flat();
  const options = flattenedArgs[flattenedArgs.length - 1];

  if (typeof options === "object" && !!options) {
    return flattenedArgs
      .slice(0, -1)
      .filter((w) => !!w)
      .join(options.separator);
  }

  return flattenedArgs.filter((w) => !!w).join(" ");
};
