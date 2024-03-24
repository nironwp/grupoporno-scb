import cache from 'cache-all/memory'

class CacheCore { 
    async initCache() {
        await cache.init({
            ttl: 90,
            isEnable: true
        })
    }

    get cache() {
        return cache
    }
}


export const cacheCore = new CacheCore()