import * as E from 'fp-ts/Either'
class CambridgeCredential {
    readonly username: string
    readonly password: string
    private constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }
    
    // public static validate(username: string, password: string)

    public static apply(username: string, password: string): CambridgeCredential {
        return new CambridgeCredential(username, password)
    }
}