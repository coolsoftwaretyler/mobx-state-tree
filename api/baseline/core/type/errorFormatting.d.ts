export interface ErrorFormattingOptions {
    enabled: boolean;
    indent: number;
    maxStringLength: number;
    maxArrayLength: number;
    maxPropertyCount: number;
    maxDepth: number;
}
export declare function setErrorFormatting(options: Partial<ErrorFormattingOptions>): void;
export declare function getErrorFormatting(): ErrorFormattingOptions;
