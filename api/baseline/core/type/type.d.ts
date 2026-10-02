import { IValidationContext, IValidationResult, IStateTreeNode, ObjectNode, ModelPrimitive, AnyNode } from "../../internal";
type Writable<T> = {
    -readonly [K in keyof T]: T[K];
};
type IsEqualConsideringWritability<A, B> = (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false;
type IsFullyWritable<T extends object> = IsEqualConsideringWritability<{
    [K in keyof T]: T[K];
}, Writable<{
    [K in keyof T]: T[K];
}>>;
type WritableKeys<T extends {}> = {
    [K in keyof T]-?: IsFullyWritable<Pick<T, K>> extends true ? K : never;
}[keyof T];
export type STNValue<T, IT extends IAnyType> = T extends object ? T & IStateTreeNode<IT> : T;
declare const $type: unique symbol;
type ExcludeReadonly<T> = T extends {} ? T[WritableKeys<T>] : T;
export interface IType<C, S, T> {
    readonly [$type]: undefined;
    name: string;
    readonly identifierAttribute?: string;
    create(snapshot?: C | ExcludeReadonly<T>, env?: any): this["Type"];
    is(thing: any): thing is C | this["Type"];
    validate(thing: C | T, context: IValidationContext): IValidationResult;
    describe(): string;
    readonly Type: STNValue<T, this>;
    readonly TypeWithoutSTN: T;
    readonly SnapshotType: S;
    readonly CreationType: C;
}
export interface IAnyType extends IType<any, any, any> {
}
export interface ISimpleType<T> extends IType<T, T, T> {
}
export type Primitives = ModelPrimitive | null | undefined;
export interface IComplexType<C, S, T> extends IType<C, S, T & object> {
}
export interface IAnyComplexType extends IType<any, any, object> {
}
export type ExtractCSTWithoutSTN<IT extends {
    [$type]: undefined;
    CreationType: any;
    SnapshotType: any;
    TypeWithoutSTN: any;
}> = IT["CreationType"] | IT["SnapshotType"] | IT["TypeWithoutSTN"];
export type ExtractCSTWithSTN<IT extends {
    [$type]: undefined;
    CreationType: any;
    SnapshotType: any;
    Type: any;
}> = IT["CreationType"] | IT["SnapshotType"] | IT["Type"];
export type Instance<T> = T extends {
    [$type]: undefined;
    Type: any;
} ? T["Type"] : T;
export type SnapshotIn<T> = T extends {
    [$type]: undefined;
    CreationType: any;
} ? T["CreationType"] : T extends IStateTreeNode<infer IT> ? IT["CreationType"] : T;
export type SnapshotOut<T> = T extends {
    [$type]: undefined;
    SnapshotType: any;
} ? T["SnapshotType"] : T extends IStateTreeNode<infer IT> ? IT["SnapshotType"] : T;
export type SnapshotOrInstance<T> = SnapshotIn<T> | Instance<T>;
export declare function canApplyDirectSnapshot(childType: IAnyType, childNode: AnyNode, newValue: any): childNode is ObjectNode<any, any, any>;
export declare function resolveDirectApplyType(type: IAnyType): IAnyType;
export declare function isType(value: any): value is IAnyType;
export {};
