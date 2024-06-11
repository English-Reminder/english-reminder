
import { assert } from 'console'
import { delay } from 'lodash' 
enum RetryStategy {
    ExponentialBackOff,
    ConstBackoff,
    LinearBackoff
}

class RetryError {
    at: number
    err: unknown
    constructor(at: number, err: unknown) {
        this.at = at
        this.err = err
    }
}

async function retry<T>(
    promiseFunc: () => Promise<T>, 
    retryTime = 0,
    retryInitDuration = 0,  
    retryStategy: RetryStategy = RetryStategy.ConstBackoff, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    retryCondition = (res: T) => true): Promise<T> 
{
    assert(retryTime > 0 && retryInitDuration > 0, "retryTime and retryInitDuration should greater or equal than 0. Got %d %d", retryTime, retryInitDuration)
    let finalErr: RetryError = null
    return new Promise((resolve, reject) => {
        let doCount = 0;
        function loopRecursive() {
            doCount+=1
            retryAtN(promiseFunc, retryTime, retryCondition).then(res => {
                resolve(res)
                return
            }).catch(err => {
                finalErr = err
                if (doCount > retryTime) {
                    reject(finalErr)
                    return
                } else {
                    delay(loopRecursive, calculateRetryAtN(doCount, retryInitDuration * 1000, retryStategy))
                }
            })
        }
        loopRecursive()
    })
    
}

function calculateRetryAtN(n: number, retryInitDuration: number, retryStategy: RetryStategy): number {
    switch(retryStategy) {
        case RetryStategy.ConstBackoff:
            return retryInitDuration
        case RetryStategy.LinearBackoff:
            return n*retryInitDuration
        case RetryStategy.ExponentialBackOff:
            return Math.pow(retryInitDuration, n)
    }
}

async function retryAtN<T>(promiseFunc: () => Promise<T>, time: number, retryCondition: (res: T) => boolean): Promise<T> {
    return new Promise((resolve, reject) => {
        promiseFunc().then(res => {
            if (retryCondition(res)) {
                resolve(res)
            } else {
                reject(new RetryError(time, new Error("Retry fail due to mismatch retry condition")))
            }
        }).catch(err => {
            reject(new RetryError(time, err))
        });
    })
}

export {
    retry,
    RetryStategy
};