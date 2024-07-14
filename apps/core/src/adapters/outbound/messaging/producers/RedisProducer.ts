import { Redis } from 'ioredis';
import { IProducerMQ } from '../../../../ports/outbound'
import { CambridgeCredentialDTO } from '../../../dtos';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { logger } from '@english-reminder/common'
class RedisProducer implements IProducerMQ {
    private readonly redisClient: Redis
    private readonly LOGIN_CHANNEL = "login_channel"
    private readonly TOTAL_LOGIN_CHANNEL: number = Number(process.env["MAX_TOTAL_LOGIN_CHANNEL"]) ?? 1
    constructor(redisClient: Redis) {
        this.redisClient = redisClient
    }
    addLoginMessage = async (credential: CambridgeCredentialDTO): Promise<number> => {
        try {
        let _ = await this.redisClient.publish(`${this.LOGIN_CHANNEL}_${this.TOTAL_LOGIN_CHANNEL}`, JSON.stringify(credential))
        return _
        } catch(e) {
            logger.error("Can't publish login message to Redis. Error: " + e)
            return 1
        }
            
    };
    updateLoginState = (progressID: string, slackUserID: string, state: string): number => {
        return 1;
    };

}

export {
    RedisProducer
}