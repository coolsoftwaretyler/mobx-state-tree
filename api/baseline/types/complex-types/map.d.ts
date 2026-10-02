import { IInterceptor, IKeyValueMap, IMapDidChange, IMapWillChange, Lambda } from "mobx";
import { IAnyType, IType, ExtractCSTWithSTN, IHooksGetter } from "../../internal";
export interface IMapType<IT extends IAnyType> extends IType<IKeyValueMap<IT["CreationType"]> | undefined, IKeyValueMap<IT["SnapshotType"]>, IMSTMap<IT>> {
    hooks(hooks: IHooksGetter<IMSTMap<IT>>): IMapType<IT>;
}
export interface IMSTMap<IT extends IAnyType> {
    clear(): void;
    delete(key: string): boolean;
    forEach(callbackfn: (value: IT["Type"], key: string | number, map: this) => void, thisArg?: any): void;
    get(key: string | number): IT["Type"] | undefined;
    has(key: string | number): boolean;
    set(key: string | number, value: ExtractCSTWithSTN<IT>): this;
    readonly size: number;
    put(value: ExtractCSTWithSTN<IT>): IT["Type"];
    keys(): IterableIterator<string>;
    values(): IterableIterator<IT["Type"]>;
    entries(): IterableIterator<[
        string,
        IT["Type"]
    ]>;
    [Symbol.iterator](): IterableIterator<[
        string,
        IT["Type"]
    ]>;
    merge(other: IMSTMap<IType<any, any, IT["TypeWithoutSTN"]>> | IKeyValueMap<ExtractCSTWithSTN<IT>> | any): this;
    replace(values: IMSTMap<IType<any, any, IT["TypeWithoutSTN"]>> | IKeyValueMap<ExtractCSTWithSTN<IT>> | any): this;
    toJSON(): IKeyValueMap<IT["SnapshotType"]>;
    toString(): string;
    [Symbol.toStringTag]: "Map";
    observe(listener: (changes: IMapDidChange<string, IT["Type"]>) => void, fireImmediately?: boolean): Lambda;
    intercept(handler: IInterceptor<IMapWillChange<string, IT["Type"]>>): Lambda;
}
export declare function map<IT extends IAnyType>(subtype: IT): IMapType<IT>;
export declare function isMapType(type: unknown): type is IMapType<IAnyType>;
