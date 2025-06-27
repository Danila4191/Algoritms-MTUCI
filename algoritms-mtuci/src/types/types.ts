export enum ElementStates {
  Default = "default",
  Changing = "changing",
  Modified = "modified",
}
export enum Direction {
  Ascending = "ascending",
  Descending = "descending",
}
export interface smalCircle {
  value: string;
  state: ElementStates;
  position: string
}
export interface arrString {
  value: string;
  state: ElementStates;
  head?: boolean,
  tail?: boolean,
  smalCircle?:smalCircle
}
export interface IStack<T> {
  push: (item: arrString) => void;
  pop: () => void;
  clear: () => void;
  getSize: () => number;
}