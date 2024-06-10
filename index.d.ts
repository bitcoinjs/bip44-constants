
export type CoinTypeNumber = number;
export type CoinTypeName = string;
export type CoinTypeTitle = string;

export type Entry = [
  CoinTypeNumber,
  CoinTypeName,
  CoinTypeTitle,
];

export const entries: Entry[];

export default entries;
