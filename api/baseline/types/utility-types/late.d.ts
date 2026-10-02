import { IAnyType } from "../../internal";
export declare function late<T extends IAnyType>(type: () => T): T;
export declare function late<T extends IAnyType>(name: string, type: () => T): T;
export declare function isLateType(type: unknown): type is IAnyType;
