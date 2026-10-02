import { IDisposer, IAnyStateTreeNode, IActionContext } from "../internal";
export type IMiddlewareEventType = "action" | "flow_spawn" | "flow_resume" | "flow_resume_error" | "flow_return" | "flow_throw";
export interface IMiddlewareEvent extends IActionContext {
    readonly type: IMiddlewareEventType;
    readonly parentId: number;
    readonly parentEvent: IMiddlewareEvent | undefined;
    readonly rootId: number;
    readonly allParentIds: number[];
}
export interface FunctionWithFlag extends Function {
    _isMSTAction?: boolean;
    _isFlowAction?: boolean;
}
export type IMiddlewareHandler = (actionCall: IMiddlewareEvent, next: (actionCall: IMiddlewareEvent, callback?: (value: any) => any) => void, abort: (value: any) => void) => any;
export declare function addMiddleware(target: IAnyStateTreeNode, handler: IMiddlewareHandler, includeHooks?: boolean): IDisposer;
export declare function decorate<T extends Function>(handler: IMiddlewareHandler, fn: T, includeHooks?: boolean): T;
