interface CambridgeAPI {
    login: (username: string, password: string) => BigInteger
    fetchWordListMetadata: (cookie: Map<string, string>) => BigInteger
    fetchWordListDetail: (cookie: Map<string, string>, wordListId: BigInteger) => BigInteger
}