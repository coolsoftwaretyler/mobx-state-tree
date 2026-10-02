export type FlowReturn<R> = R extends Promise<infer T> ? T : R;
export declare function flow<R, Args extends any[]>(generator: (...args: Args) => Generator<PromiseLike<any>, R, any>): (...args: Args) => Promise<FlowReturn<R>>;
export declare function castFlowReturn<T>(val: T): T;
export declare function toGeneratorFunction<R, Args extends any[]>(p: (...args: Args) => Promise<R>): (...args: Args) => Generator<Promise<R>, R, R>;
export declare function toGenerator<R>(p: Promise<R>): Generator<Promise<R>, R, R>;
