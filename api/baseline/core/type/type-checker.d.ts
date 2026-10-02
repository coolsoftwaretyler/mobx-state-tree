import { IAnyType, ExtractCSTWithSTN } from "../../internal";
export interface IValidationContextEntry {
    path: string;
    type: IAnyType;
}
export type IValidationContext = IValidationContextEntry[];
export interface IValidationError {
    context: IValidationContext;
    value: any;
    message?: string;
}
export type IValidationResult = IValidationError[];
export declare function typecheck<IT extends IAnyType>(type: IT, value: ExtractCSTWithSTN<IT>): void;
