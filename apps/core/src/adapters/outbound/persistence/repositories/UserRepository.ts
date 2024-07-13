import { Redis } from "ioredis";
import { UserRepository } from "../../../../ports/outbound";
import { CambridgeCredentialDTO, LoggingInStatus } from "../../../dtos";
import { Pool } from "pg";

class UserRepositoryImpl implements UserRepository {
    private readonly loggingKey: string = "loggingIn"
    private readonly redis: Redis
    private databasePool: Pool
    constructor(redis: Redis, databasePool: Pool) {
        this.redis = redis
        this.databasePool = databasePool
    }
    async saveCambridgeCredential(credential: CambridgeCredentialDTO): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async getCambridgeCredentialStatus(slackUserID: string): Promise<LoggingInStatus> {
        throw new Error("Method not implemented.");
    }
    async lockCambridgeLogin(slackUserID: string): Promise<number> {
        const conditionalUpdateScript = `
            if redis.call("GET", KEYS[1]) == ARGV[1] then
                redis.call("SET", KEYS[1], ARGV[2])
                return 0
            else
                return 1
            end
        `;
        try {
            return await this.redis.eval(conditionalUpdateScript, 1, `${slackUserID}_${this.loggingKey}`, 0, 1) as number;
            
        } catch {
            return -1
        }
    }

    async releaseLockCambridgeLogin(slackUserID: string): Promise<number> {
        try {
            await this.redis.set(this.loggingKey, 0)
            return 0
        } catch {
            return 1
        }
        
    }
    
}