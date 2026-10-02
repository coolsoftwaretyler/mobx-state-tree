import { IType, IAnyType } from "../../internal";
export interface IMaybeIType<IT extends IAnyType, C, O> extends IType<IT["CreationType"] | C, IT["SnapshotType"] | O, IT["TypeWithoutSTN"] | O> {
}
export interface IMaybe<IT extends IAnyType> extends IMaybeIType<IT, undefined, undefined> {
}
export interface IMaybeNull<IT extends IAnyType> extends IMaybeIType<IT, null | undefined, null> {
}
export declare function maybe<IT extends IAnyType>(type: IT): IMaybe<IT>;
export declare function maybeNull<IT extends IAnyType>(type: IT): IMaybeNull<IT>;
