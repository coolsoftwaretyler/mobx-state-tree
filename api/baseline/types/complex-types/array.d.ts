import { IObservableArray } from "mobx";
import { ExtractCSTWithSTN, IAnyType, IHooksGetter, IType } from "../../internal";
export interface IMSTArray<IT extends IAnyType> extends IObservableArray<IT["Type"]> {
    push(...items: IT["Type"][]): number;
    push(...items: ExtractCSTWithSTN<IT>[]): number;
    concat(...items: ConcatArray<IT["Type"]>[]): IT["Type"][];
    concat(...items: ConcatArray<ExtractCSTWithSTN<IT>>[]): IT["Type"][];
    concat(...items: (IT["Type"] | ConcatArray<IT["Type"]>)[]): IT["Type"][];
    concat(...items: (ExtractCSTWithSTN<IT> | ConcatArray<ExtractCSTWithSTN<IT>>)[]): IT["Type"][];
    splice(start: number, deleteCount?: number): IT["Type"][];
    splice(start: number, deleteCount: number, ...items: IT["Type"][]): IT["Type"][];
    splice(start: number, deleteCount: number, ...items: ExtractCSTWithSTN<IT>[]): IT["Type"][];
    unshift(...items: IT["Type"][]): number;
    unshift(...items: ExtractCSTWithSTN<IT>[]): number;
}
export interface IArrayType<IT extends IAnyType> extends IType<readonly IT["CreationType"][] | undefined, IT["SnapshotType"][], IMSTArray<IT>> {
    hooks(hooks: IHooksGetter<IMSTArray<IAnyType>>): IArrayType<IT>;
}
export declare function array<IT extends IAnyType>(subtype: IT): IArrayType<IT>;
export declare function isArrayType(type: unknown): type is IArrayType<IAnyType>;
