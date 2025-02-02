export interface Value<T> {
    readonly value: T;
    is(item: Value<T>): boolean;
    isValue(value: T): boolean;
}
  