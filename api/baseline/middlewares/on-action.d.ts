import { IDisposer, IAnyStateTreeNode, IActionContext } from "../internal";
export interface ISerializedActionCall {
    name: string;
    path?: string;
    args?: any[];
}
export interface IActionRecorder {
    actions: ReadonlyArray<ISerializedActionCall>;
    readonly recording: boolean;
    stop(): void;
    resume(): void;
    replay(target: IAnyStateTreeNode): void;
}
export declare function applyAction(target: IAnyStateTreeNode, actions: ISerializedActionCall | ISerializedActionCall[]): void;
export declare function recordActions(subject: IAnyStateTreeNode, filter?: (action: ISerializedActionCall, actionContext: IActionContext | undefined) => boolean): IActionRecorder;
export declare function onAction(target: IAnyStateTreeNode, listener: (call: ISerializedActionCall) => void, attachAfter?: boolean): IDisposer;
