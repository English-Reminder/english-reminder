class UserDTO {
    slackUserID: string
    cambridgeUserID: string
    
    constructor(slackUserID: string, cambridgeUserID: string) {
        this.slackUserID = slackUserID
        this.cambridgeUserID = cambridgeUserID
    }
}