import { IMiddlewareEvent, IMiddlewareHandler } from "../internal";
export interface IActionTrackingMiddlewareHooks<T> {
    filter?: (call: IMiddlewareEvent) => boolean;
    onStart: (call: IMiddlewareEvent) => T;
    onResume: (call: IMiddlewareEvent, context: T) => void;
    onSuspend: (call: IMiddlewareEvent, context: T) => void;
    onSuccess: (call: IMiddlewareEvent, context: T, result: any) => void;
    onFail: (call: IMiddlewareEvent, context: T, error: any) => void;
}
export declare function createActionTrackingMiddleware<T = any>(hooks: IActionTrackingMiddlewareHooks<T>): IMiddlewareHandler;
