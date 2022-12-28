export interface ICacheRecord<T> {
    key: string;
    expires: Date;
    value: T;
}
