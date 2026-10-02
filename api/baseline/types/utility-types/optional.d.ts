import { IType, IAnyType, ExtractCSTWithSTN } from "../../internal";
export type ValidOptionalValue = string | boolean | number | null | undefined;
export type ValidOptionalValues = [
    ValidOptionalValue,
    ...ValidOptionalValue[]
];
export type OptionalDefaultValueOrFunction<IT extends IAnyType> = IT["CreationType"] | IT["SnapshotType"] | (() => ExtractCSTWithSTN<IT>);
export interface IOptionalIType<IT extends IAnyType, OptionalVals extends ValidOptionalValues> extends IType<IT["CreationType"] | OptionalVals[number], IT["SnapshotType"], IT["TypeWithoutSTN"]> {
}
export declare function optional<IT extends IAnyType>(type: IT, defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>): IOptionalIType<IT, [
    undefined
]>;
export declare function optional<IT extends IAnyType, OptionalVals extends ValidOptionalValues>(type: IT, defaultValueOrFunction: OptionalDefaultValueOrFunction<IT>, optionalValues: OptionalVals): IOptionalIType<IT, OptionalVals>;
export declare function isOptionalType(type: unknown): type is IOptionalIType<IAnyType, [
    any,
    ...any[]
]>;
