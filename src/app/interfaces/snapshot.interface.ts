export interface IAllocationWithBreakdown {
    [key: string]: {
        total: number;
        [criteria: string]: number;
    };
}

export interface ISnapshot {
    timestamp: string;
    allocation: IAllocationWithBreakdown;
}

export interface ISnapshotResponse {
    currSnapshot: ISnapshot;
    prevSnapshot: ISnapshot;
}
