declare function redisWriteData(key: string, data: any, ttl?: number): Promise<void>;
declare function redisGetData(key: string): Promise<any>;
declare function redisDelData(key: string): Promise<void>;
export { redisWriteData, redisGetData, redisDelData };
