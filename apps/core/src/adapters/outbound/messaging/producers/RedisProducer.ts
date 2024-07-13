import { redis } from '../../../../infrastructure';
import { ProducerMQ } from '../../../../ports/outbound'
import { CambridgeCredentialDTO } from '../../../dtos';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { logger } from '@english-reminder/common'
class RedisProducer implements ProducerMQ {
    addLoginMessage = (credential: CambridgeCredentialDTO): number => {
        try {
        redis.publish("login_channel", JSON.stringify(credential))
        return 0
        } catch(e) {
            logger.error("Can't publish login message to Redis. Error: " + e)
            return 1
        }
            
    };
    updateLoginState = (progressID: string, slackUserID: string, state: string): number => {
        return 1;
    };

}