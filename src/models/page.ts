export interface Page<T> {
    fallback: {
        [cacheKey: string]: T;
    };
}
