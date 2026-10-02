import { IMiddlewareHandler, IActionContext } from "../internal";
export interface IActionTrackingMiddleware2Call<TEnv> extends Readonly<IActionContext> {
    env: TEnv | undefined;
    readonly parentCall?: IActionTrackingMiddleware2Call<TEnv>;
}
export interface IActionTrackingMiddleware2Hooks<TEnv> {
    filter?: (call: IActionTrackingMiddleware2Call<TEnv>) => boolean;
    onStart: (call: IActionTrackingMiddleware2Call<TEnv>) => void;
    onFinish: (call: IActionTrackingMiddleware2Call<TEnv>, error?: any) => void;
}
export declare function createActionTrackingMiddleware2<TEnv = any>(middlewareHooks: IActionTrackingMiddleware2Hooks<TEnv>): IMiddlewareHandler;
