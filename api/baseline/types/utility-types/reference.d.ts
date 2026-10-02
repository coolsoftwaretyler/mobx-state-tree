import { IType, IAnyType, IAnyStateTreeNode, IAnyComplexType, IMaybe, ReferenceIdentifier, IStateTreeNode } from "../../internal";
export type OnReferenceInvalidatedEvent<STN extends IAnyStateTreeNode> = {
    parent: IAnyStateTreeNode;
    invalidTarget: STN | undefined;
    invalidId: ReferenceIdentifier;
    replaceRef: (newRef: STN | null | undefined) => void;
    removeRef: () => void;
    cause: "detach" | "destroy" | "invalidSnapshotReference";
};
export type OnReferenceInvalidated<STN extends IAnyStateTreeNode> = (event: OnReferenceInvalidatedEvent<STN>) => void;
export type ReferenceT<IT extends IAnyType> = IT["TypeWithoutSTN"] & IStateTreeNode<IReferenceType<IT>>;
export interface ReferenceOptionsGetSet<IT extends IAnyComplexType> {
    get(identifier: ReferenceIdentifier, parent: IAnyStateTreeNode | null): ReferenceT<IT>;
    set(value: ReferenceT<IT>, parent: IAnyStateTreeNode | null): ReferenceIdentifier;
}
export interface ReferenceOptionsOnInvalidated<IT extends IAnyComplexType> {
    onInvalidated: OnReferenceInvalidated<ReferenceT<IT>>;
}
export type ReferenceOptions<IT extends IAnyComplexType> = ReferenceOptionsGetSet<IT> | ReferenceOptionsOnInvalidated<IT> | (ReferenceOptionsGetSet<IT> & ReferenceOptionsOnInvalidated<IT>);
export interface IReferenceType<IT extends IAnyComplexType> extends IType<ReferenceIdentifier, ReferenceIdentifier, IT["TypeWithoutSTN"]> {
}
export declare function reference<IT extends IAnyComplexType>(subType: IT, options?: ReferenceOptions<IT>): IReferenceType<IT>;
export declare function isReferenceType(type: unknown): type is IReferenceType<IAnyComplexType>;
export declare function safeReference<IT extends IAnyComplexType>(subType: IT, options: (ReferenceOptionsGetSet<IT> | {}) & {
    acceptsUndefined: false;
    onInvalidated?: OnReferenceInvalidated<ReferenceT<IT>>;
}): IReferenceType<IT>;
export declare function safeReference<IT extends IAnyComplexType>(subType: IT, options?: (ReferenceOptionsGetSet<IT> | {}) & {
    acceptsUndefined?: boolean;
    onInvalidated?: OnReferenceInvalidated<ReferenceT<IT>>;
}): IMaybe<IReferenceType<IT>>;
