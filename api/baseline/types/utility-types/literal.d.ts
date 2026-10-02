import { ISimpleType, Primitives } from "../../internal";
export declare function literal<S extends Primitives>(value: S): ISimpleType<S>;
export declare function isLiteralType(type: unknown): type is ISimpleType<any>;
