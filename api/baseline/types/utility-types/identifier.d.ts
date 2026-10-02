import { ISimpleType, IType } from "../../internal";
export declare const identifier: ISimpleType<string>;
export declare const identifierNumber: ISimpleType<number>;
export declare const identifierBigint: IType<bigint | string | number, string, bigint>;
export declare function isIdentifierType(type: unknown): type is typeof identifier | typeof identifierNumber | typeof identifierBigint;
export type ReferenceIdentifier = string | number | bigint;
