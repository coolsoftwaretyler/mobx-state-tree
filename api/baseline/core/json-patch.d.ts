export interface IJsonPatch {
    readonly op: "replace" | "add" | "remove";
    readonly path: string;
    readonly value?: any;
}
export interface IReversibleJsonPatch extends IJsonPatch {
    readonly oldValue: any;
}
export declare function escapeJsonPath(path: string): string;
export declare function unescapeJsonPath(path: string): string;
export declare function joinJsonPath(path: string[]): string;
export declare function splitJsonPath(path: string): string[];
