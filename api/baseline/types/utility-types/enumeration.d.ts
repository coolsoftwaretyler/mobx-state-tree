import { ISimpleType } from "../../internal";
export type UnionStringArray<T extends readonly (string | number)[]> = T[number];
export declare function enumeration<T extends string | number>(options: readonly T[]): ISimpleType<UnionStringArray<T[]>>;
export declare function enumeration<T extends string | number>(name: string, options: readonly T[]): ISimpleType<UnionStringArray<T[]>>;
