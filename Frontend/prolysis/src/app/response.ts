export interface ServerResponse {
    uName: string;
    contestID: number;
    uID: number;
    uEmail: string;
    data: {
        pID: number,
        x: string,
        y: string,
        data?: number[][];
    }[];
}
