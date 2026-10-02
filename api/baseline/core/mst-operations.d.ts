import { IAnyStateTreeNode, IType, IAnyModelType, IStateTreeNode, IJsonPatch, IDisposer, IAnyType, ReferenceIdentifier, TypeOfValue, IActionContext, IAnyComplexType } from "../internal";
export type TypeOrStateTreeNodeToStateTreeNode<T extends IAnyType | IAnyStateTreeNode> = T extends IType<any, any, infer TT> ? TT & IStateTreeNode<T> : T;
export declare function getType(object: IAnyStateTreeNode): IAnyComplexType;
export declare function getChildType(object: IAnyStateTreeNode, propertyName?: string): IAnyType;
export declare function onPatch(target: IAnyStateTreeNode, callback: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer;
export declare function onSnapshot<S>(target: IStateTreeNode<IType<any, S, any>>, callback: (snapshot: S) => void): IDisposer;
export declare function applyPatch(target: IAnyStateTreeNode, patch: IJsonPatch | ReadonlyArray<IJsonPatch>): void;
export interface IPatchRecorder {
    patches: ReadonlyArray<IJsonPatch>;
    inversePatches: ReadonlyArray<IJsonPatch>;
    reversedInversePatches: ReadonlyArray<IJsonPatch>;
    readonly recording: boolean;
    stop(): void;
    resume(): void;
    replay(target?: IAnyStateTreeNode): void;
    undo(target?: IAnyStateTreeNode): void;
}
export declare function recordPatches(subject: IAnyStateTreeNode, filter?: (patch: IJsonPatch, inversePatch: IJsonPatch, actionContext: IActionContext | undefined) => boolean): IPatchRecorder;
export declare function protect(target: IAnyStateTreeNode): void;
export declare function unprotect(target: IAnyStateTreeNode): void;
export declare function isProtected(target: IAnyStateTreeNode): boolean;
export declare function applySnapshot<C>(target: IStateTreeNode<IType<C, any, any>>, snapshot: C): void;
export declare function getSnapshot<S>(target: IStateTreeNode<IType<any, S, any>>, applyPostProcess?: boolean): S;
export declare function hasParent(target: IAnyStateTreeNode, depth?: number): boolean;
export declare function getParent<IT extends IAnyStateTreeNode | IAnyComplexType>(target: IAnyStateTreeNode, depth?: number): TypeOrStateTreeNodeToStateTreeNode<IT>;
export declare function hasParentOfType(target: IAnyStateTreeNode, type: IAnyComplexType): boolean;
export declare function getParentOfType<IT extends IAnyComplexType>(target: IAnyStateTreeNode, type: IT): IT["Type"];
export declare function getRoot<IT extends IAnyComplexType | IAnyStateTreeNode>(target: IAnyStateTreeNode): TypeOrStateTreeNodeToStateTreeNode<IT>;
export declare function getPath(target: IAnyStateTreeNode): string;
export declare function getPathParts(target: IAnyStateTreeNode): string[];
export declare function isRoot(target: IAnyStateTreeNode): boolean;
export declare function resolvePath(target: IAnyStateTreeNode, path: string): any;
export declare function resolveIdentifier<IT extends IAnyModelType>(type: IT, target: IAnyStateTreeNode, identifier: ReferenceIdentifier): IT["Type"] | undefined;
export declare function getIdentifier(target: IAnyStateTreeNode): string | null;
export declare function tryReference<N extends IAnyStateTreeNode>(getter: () => N | null | undefined, checkIfAlive?: boolean): N | undefined;
export declare function isValidReference<N extends IAnyStateTreeNode>(getter: () => N | null | undefined, checkIfAlive?: boolean): boolean;
export declare function tryResolve(target: IAnyStateTreeNode, path: string): any;
export declare function getRelativePath(base: IAnyStateTreeNode, target: IAnyStateTreeNode): string;
export declare function clone<T extends IAnyStateTreeNode>(source: T, keepEnvironment?: boolean | any): T;
export declare function detach<T extends IAnyStateTreeNode>(target: T): T;
export declare function destroy(target: IAnyStateTreeNode): void;
export declare function isAlive(target: IAnyStateTreeNode): boolean;
export declare function addDisposer(target: IAnyStateTreeNode, disposer: IDisposer): IDisposer;
export declare function getEnv<T = any>(target: IAnyStateTreeNode): T;
export declare function hasEnv(target: IAnyStateTreeNode): boolean;
export declare function walk(target: IAnyStateTreeNode, processor: (item: IAnyStateTreeNode) => void): void;
export interface IModelReflectionPropertiesData {
    name: string;
    properties: {
        [K: string]: IAnyType;
    };
}
export declare function getPropertyMembers(typeOrNode: IAnyModelType | IAnyStateTreeNode): IModelReflectionPropertiesData;
export interface IModelReflectionData extends IModelReflectionPropertiesData {
    actions: string[];
    views: string[];
    volatile: string[];
    flowActions: string[];
}
export declare function getMembers(target: IAnyStateTreeNode): IModelReflectionData;
export declare function cast<O extends string | number | boolean | null | undefined = never>(snapshotOrInstance: O): O;
export declare function cast<O = never>(snapshotOrInstance: TypeOfValue<O>["CreationType"] | TypeOfValue<O>["SnapshotType"] | TypeOfValue<O>["Type"]): O;
export declare function castToSnapshot<I>(snapshotOrInstance: I): Extract<I, IAnyStateTreeNode> extends never ? I : TypeOfValue<I>["CreationType"];
export declare function castToReferenceSnapshot<I>(instance: I): Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier;
export declare function getNodeId(target: IAnyStateTreeNode): number;
