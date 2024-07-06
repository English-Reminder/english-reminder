import * as E from 'fp-ts/Either'
class CambridgeCredential {
    readonly username: string
    readonly password: string
    public constructor(username: string, password: string) {
        this.username = username
        this.password = password
    }
}

export {
    CambridgeCredential
}