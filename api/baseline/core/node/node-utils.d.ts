import { IAnyType, STNValue, Instance, IAnyComplexType } from "../../internal";
declare const $stateTreeNodeType: unique symbol;
export interface IStateTreeNode<IT extends IAnyType = IAnyType> {
    readonly [$stateTreeNodeType]?: [
        IT
    ] | [
        any
    ];
}
export type TypeOfValue<T extends IAnyStateTreeNode> = T extends IStateTreeNode<infer IT> ? IT : never;
export interface IAnyStateTreeNode extends STNValue<any, IAnyType> {
}
export declare function isStateTreeNode<IT extends IAnyComplexType = IAnyComplexType>(value: any): value is STNValue<Instance<IT>, IT>;
export {};
