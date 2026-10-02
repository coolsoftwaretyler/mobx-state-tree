import { IAnyStateTreeNode, IMiddlewareEvent } from "../internal";
export interface IActionContext {
    readonly name: string;
    readonly id: number;
    readonly parentActionEvent: IMiddlewareEvent | undefined;
    readonly context: IAnyStateTreeNode;
    readonly tree: IAnyStateTreeNode;
    readonly args: any[];
}
export declare function getRunningActionContext(): IActionContext | undefined;
export declare function isActionContextChildOf(actionContext: IActionContext, parent: number | IActionContext | IMiddlewareEvent): boolean;
export declare function isActionContextThisOrChildOf(actionContext: IActionContext, parentOrThis: number | IActionContext | IMiddlewareEvent): boolean;
