import { Redis } from "ioredis";
import { IUserRepository } from "../../../../ports/outbound";
import { CambridgeCredentialDTO, LoggingInStatusDTO } from "../../../dtos";
import { Pool } from "pg";
import { Either } from "fp-ts/lib/Either";
import { ErrorDTO, GetLoginStatusErrorDTO } from "../../../dtos/ErrorDTO";
import { logger } from "@english-reminder/common";
import { either } from "fp-ts";

class UserRepositoryImpl implements IUserRepository {
    private readonly loggingKey: string = "loggingIn"
    private readonly redis: Redis
    private databasePool: Pool
    constructor(redis: Redis, databasePool: Pool) {
        this.redis = redis
        this.databasePool = databasePool
    }
    async saveCambridgeCredential(credential: CambridgeCredentialDTO): Promise<Either<ErrorDTO, unknown>> {
        // this.databasePool.query()
        logger.info("Save credential into database: " + credential.toString())
        return either.right(undefined)
    }
    async getCambridgeCredentialStatus(slackUserID: string): Promise<Either<GetLoginStatusErrorDTO, LoggingInStatusDTO>> {
        throw new Error("Method not implemented.");
    }
    // async lockCambridgeLogin(slackUserID: string): Promise<number> {
    //     const conditionalUpdateScript = `
    //         if redis.call("GET", KEYS[1]) == ARGV[1] then
    //             redis.call("SET", KEYS[1], ARGV[2])
    //             return 0
    //         else
    //             return 1
    //         end
    //     `;
    //     try {
    //         return await this.redis.eval(conditionalUpdateScript, 1, `${slackUserID}_${this.loggingKey}`, 0, 1) as number;
            
    //     } catch {
    //         return -1
    //     }
    // }

    // async releaseLockCambridgeLogin(slackUserID: string): Promise<number> {
    //     try {
    //         await this.redis.set(this.loggingKey, 0)
    //         return 0
    //     } catch {
    //         return 1
    //     }
        
    // }
    
}

export {
    UserRepositoryImpl
}