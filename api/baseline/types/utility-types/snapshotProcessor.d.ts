import { IType, IAnyType, Instance } from "../../internal";
declare const $mstNotCustomized: unique symbol;
export interface _NotCustomized {
    readonly [$mstNotCustomized]: undefined;
}
export type _CustomOrOther<Custom, Other> = Custom extends _NotCustomized ? Other : Custom;
export interface ISnapshotProcessor<IT extends IAnyType, CustomC, CustomS> extends IType<_CustomOrOther<CustomC, IT["CreationType"]>, _CustomOrOther<CustomS, IT["SnapshotType"]>, IT["TypeWithoutSTN"]> {
}
export interface ISnapshotProcessors<IT extends IAnyType, CustomC, CustomS> {
    preProcessor?(snapshot: _CustomOrOther<CustomC, IT["CreationType"]>): IT["CreationType"];
    postProcessor?(snapshot: IT["SnapshotType"], node: Instance<IT>): _CustomOrOther<CustomS, IT["SnapshotType"]>;
}
export declare function snapshotProcessor<IT extends IAnyType, CustomC = _NotCustomized, CustomS = _NotCustomized>(type: IT, processors: ISnapshotProcessors<IT, CustomC, CustomS>, name?: string): ISnapshotProcessor<IT, CustomC, CustomS>;
export {};
