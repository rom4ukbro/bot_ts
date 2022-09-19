declare type schedule = {
    date?: string;
    day?: string;
    items?: {
        number: string;
        timeBounds: string;
        info: string;
    }[];
};
declare function getData(html: string): schedule | {
    vx: string;
};
export { getData };
