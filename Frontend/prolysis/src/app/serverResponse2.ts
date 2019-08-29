export interface ServerResponse2 {
    uName: string;
    uID: number;
    data: {
        cID: number,
        uName: string,
        x: string,
        y: string,
        data?: number[][];
    }[];
}
