export type LivelinessMode = "warn" | "error" | "ignore";
export declare function setLivelinessChecking(mode: LivelinessMode): void;
export declare function getLivelinessChecking(): LivelinessMode;
export type LivelynessMode = LivelinessMode;
export declare function setLivelynessChecking(mode: LivelinessMode): void;
