import { IType, IAnyType, _NotCustomized } from "../../internal";
export type ITypeDispatcher<Types extends IAnyType[]> = (snapshot: Types[number]["SnapshotType"]) => Types[number];
export interface UnionOptions<Types extends IAnyType[]> {
    eager?: boolean;
    dispatcher?: ITypeDispatcher<Types>;
}
export type _CustomCSProcessor<T> = Exclude<T, _NotCustomized> extends never ? _NotCustomized : Exclude<T, _NotCustomized>;
export interface ITypeUnion<C, S, T> extends IType<_CustomCSProcessor<C>, _CustomCSProcessor<S>, T> {
}
export type IUnionType<Types extends IAnyType[]> = ITypeUnion<Types[number]["CreationType"], Types[number]["SnapshotType"], Types[number]["TypeWithoutSTN"]>;
export declare function union<Types extends IAnyType[]>(...types: Types): IUnionType<Types>;
export declare function union<Types extends IAnyType[]>(options: UnionOptions<Types>, ...types: Types): IUnionType<Types>;
export declare function isUnionType(type: unknown): type is IUnionType<IAnyType[]>;
