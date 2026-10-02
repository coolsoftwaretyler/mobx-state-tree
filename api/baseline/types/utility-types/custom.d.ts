import { IType } from "../../internal";
export interface CustomTypeOptions<S, T> {
    name: string;
    fromSnapshot(snapshot: S, env?: any): T;
    toSnapshot(value: T): S;
    isTargetType(value: T | S): boolean;
    getValidationMessage(snapshot: S): string;
}
export declare function custom<S, T>(options: CustomTypeOptions<S, T>): IType<S | T, S, T>;
