import axios, { AxiosResponse } from "axios"
import { retry, RetryStategy } from "../retry"
import {CAMBRIDGE_API_KEY, CAMBRIDGE_COOKIE_GIGYA_VER_KEY, CAMBRIDGE_COOKIE_GIGYA_VER_VALUE, CAMBRIDGE_DICTIONARY_HOST, CAMBRIDGE_LOGIN_HOST, CAMBRIDGE_LOGIN_PORT_PATH, CAMBRIDGE_LOGIN_TOKEN_COOKIE_KEY, CAMBRIDGE_LOGIN_UI_PATH, CAMBRIDGE_SDK_BUILD, WORDLIST_WORD_PER_PAGE} from "./CambridgeConstant"
import * as cookie from 'cookie'
import { stringify } from "qs"
import { logger }  from "../logger"
import * as E from 'fp-ts/Either'

interface ICambridgeAPI {
    login: (username: string, password: string) => Promise<E.Either<CambridgeAPIError, CambridgeLoginUserResponse>>
    // fetchWordListMetadata: (cookie: Map<string, string>) => BigInteger
    fetchWordListDetail: (session_token: string, wordListId: WordListMetadata) => Promise<E.Either<CambridgeAPIError, Array<WordMetadata>>>,
    fetchWordListMetadata: (loginToken: string, sessionToken: string) => Promise<E.Either<CambridgeAPIError, Array<WordListMetadata>>>
}

interface ICambridgeWordParser {
    parser: (data: any) => Array<Word>
}

enum CambridgeAPIError {
    GetCookieFromUIError,
    InvalidUsernameOrPasswordError,
    UnknownLoginError,
    GetUserInfoFromGigyaError,
    GetSessionTokenError,
    CantGetSessionTokenFromSetCookie,
    UnauthorizedError,
    WordListMetadataEmptyString,
    UnknownFetchWordListMetadatasError,
    FetchWordDetailUnknownError,
    FetchWordDetailNotFoundError,
    ParseWordDetailError
}



interface CambridgeLoginSimpleResponse {
    apiVersion: number,
    callId: string,
    created: string,
    createdTimestamp: number,
    errorCode: number,
    statusCode: number,
    statusReason: string
}

interface Profile {
    firstName: string,
    lastName: string,
    country: string,
    email: string,
}

interface UserInfo {
    UID: string,
    UIDSig: string,
    UIDSignature: string,
    signatureTimestamp: number
}

interface UserSessionInfo {
    login_token: string,
    expires_in: string,
    login_ui_cookie: LoginUICookie
}

type LoginUICookie = string
interface CambridgeLoginUserResponse extends CambridgeLoginSimpleResponse{
    profile: Profile,
    sessionInfo: UserSessionInfo,
    userInfo: UserInfo,
    verifiedTimestamp: number
}

interface WordListMetadata {
    id: number,
    count: number,
    shared: boolean,
    creationDate: number,
    modificationDate: number,
    name: string,
    userId: string,
    wordlistEntries: [],
    metadatas: any,
    userMetadatas: any
}

interface WordMetadata {
    "id": number,
    "entryId": string,
    "headword": string,
    "senseId": string,
    "dictCode": string,
    "definition": string,
    "metaData": null,
    "pos": string,
    "soundUK": string,
    "soundUS": string,
    "soundUKMp3": string,
    "soundUKOgg": string,
    "soundUSMp3": string,
    "soundUSOgg": string,
    "translation": string,
    "wordlistId": number,
    "entryUrl": string,
    "cefrLevel": string,
    "domain": string,
    "gram": string,
    "region": string,
    "usage": string
}

interface Word {
    // .pr dictionary[data-id]
    dictionaryId: string
    headword: string,
    ukPronounce: string | null,
    usPronounce: string | null,
    position: string
    definitionGroups: [
        headword: string,
        position: string,
        guideword: string | null,
        definitions: [
            cerfLevel: string | null,
            definition: string,
            senseID: string,
            examples: Array<string>,
            synonyms: [
                headword: string,
                entry: string
            ],
            seeAlso: [
                headword: string,
                entry: string
            ],
            thesaureses: [
                title: string,
                words: [
                    word: string,
                    example: string
                ]
            ]
        ],
        phrases: [
            title: string,
            definitions: [
                senseID: string,
                cerfLevel: string|null,
                definition: string,
                example: Array<string>
            ],
            cerfLevel: string | null, 
            examples: Array<string>
        ],
        // dsenWord: Option<string>,
        // dsenPos: Option<string>,
    ],
    
    grammars: [
        title: string,
        explain: string,
        entry: string
    ],


    phrasalVerbs: [
        title: string,
        entry: string
    ],

    idioms: [
        title: string,
        entry: string
    ],
    extendedExamples: Array<string>

}

const COOKIE_NEEDED = ["gmid", "ucid", "hasGmid"]
class CambridgeAPIImpl implements ICambridgeAPI {
    wordParser: ICambridgeWordParser
    temp = ''

    constructor(wordParser: ICambridgeWordParser) {
        this.wordParser = wordParser
    }
    _getUILoginCookie = async (): Promise<E.Either<CambridgeAPIError, string>> => {
        try {
            const response = await retry(() => axios.get(`${CAMBRIDGE_LOGIN_HOST}/${CAMBRIDGE_LOGIN_UI_PATH}?apiKey=4_5rnY1vVhTXaiyHmFSwS_Lw&pageURL=https%3A%2F%2Fdictionary.cambridge.org%2F&sdk=js_latest&sdkBuild=${CAMBRIDGE_SDK_BUILD}&format=json`, {
                // withCredentials: true,
                headers: {
                    "accept": "*/*",
                    "accept-language": "vi",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "cookie": "gig3pctest=true",
                    "Referer": "https://cdns.eu1.gigya.com/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                timeout: 10000
            }), 3, 1, RetryStategy.ExponentialBackOff)
            if (!this.temp)
                this.temp = COOKIE_NEEDED.map(key => `${key}=${cookie.parse(response.headers["set-cookie"]!.join(';'))[key]}`).join("; ")
            return E.right(COOKIE_NEEDED.map(key => `${key}=${cookie.parse(response.headers["set-cookie"]!.join(';'))[key]}`).join("; "))
        } catch (err) {
            return E.left(CambridgeAPIError.GetCookieFromUIError)
        }
    }
    _loginUsingCookie = async (username: string, password: string, cookieStr: string): Promise<E.Either<CambridgeAPIError, CambridgeLoginSimpleResponse>> => {
        try {
            const response: AxiosResponse<CambridgeLoginSimpleResponse> = await retry(() => {
                return axios.post(`${CAMBRIDGE_LOGIN_HOST}/${CAMBRIDGE_LOGIN_PORT_PATH}`, 
                stringify({
                    loginID: username,
                    password: password,
                    sessionExpiration: 31536000,
                    targetEnv: "jssdk",
                    include: "profile,data,emails,subscriptions,preferences,",
                    includeUserInfo: true,
                    loginMode: "standard",
                    lang: "en",
                    APIKey: "4_5rnY1vVhTXaiyHmFSwS_Lw",
                    cid: "CDO",
                    source: "showScreenSet",
                    sdk: "js_latest",
                    authMode: "cookie",
                    pageURL: "https://dictionary.cambridge.org/",
                    sdkBuild: CAMBRIDGE_SDK_BUILD,
                    format: "json"
                }),
                {
                    withCredentials: true,
                    headers: {
                        "accept": "*/*",
                        "accept-language": "vi",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded",
                        "pragma": "no-cache",
                        "priority": "u=1, i",
                        "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "cookie": cookieStr,
                        "Referer": "https://cdns.eu1.gigya.com/",
                        "Referrer-Policy": "strict-origin-when-cross-origin",
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
                    },
                    timeout: 10000
                    // validateStatus: function (status) {
                    //     return status == 200 || status == 403
                    // },
                
                })
            }, 3, 2, RetryStategy.ConstBackoff)
            return E.right(response.data)
        } catch(err) {
            return E.left(CambridgeAPIError.UnknownLoginError)
        }
    }
    login = async (username: string, password: string): Promise<E.Either<CambridgeAPIError, CambridgeLoginUserResponse>> => {
        const cookieString = await this._getUILoginCookie();
        if (E.isLeft(cookieString)) {
            return cookieString
        }

        const loginInfo = await this._loginUsingCookie(username, password, cookieString.right)
        if (E.isLeft(loginInfo)) {
            return loginInfo
        }
        if (loginInfo.right.errorCode == 403) {
            return E.left(CambridgeAPIError.InvalidUsernameOrPasswordError)
        }
        const _loginInfo = loginInfo.right as CambridgeLoginUserResponse;
        _loginInfo.sessionInfo.login_ui_cookie = cookieString.right
        logger.debug(_loginInfo.sessionInfo.login_token)
        logger.debug(_loginInfo.userInfo.UID)
        logger.debug(_loginInfo.userInfo.UIDSignature)
        logger.debug(_loginInfo.userInfo.UIDSig)
        return E.right(_loginInfo)

    }
    getUserInfo = async (user_session: UserSessionInfo): Promise<E.Either<CambridgeAPIError, UserInfo>> => {
        const userInfo = await this._getUserInfo(user_session)
        if (E.isLeft(userInfo)) {
            return userInfo
        }
        return userInfo
    }
    _getUserInfo = async (user_session: UserSessionInfo): Promise<E.Either<CambridgeAPIError, UserInfo>> => {
        const data = new FormData()
        data.append("enabledProviders", "*")
        data.append("signIDs", "true")
        data.append("APIKey", CAMBRIDGE_API_KEY)
        data.append("cid", "CDO")
        data.append("sdk", "js_latest")
        data.append("authMode", "cookie")
        data.append("pageURL", `${CAMBRIDGE_DICTIONARY_HOST}/`)
        data.append("sdkBuild", CAMBRIDGE_SDK_BUILD)
        data.append("format", "json")
        data.append("login_token", user_session.login_token)
        try {
            const response = await retry(
                () => axios.post<UserInfo>("https://socialize.eu1.gigya.com/socialize.getUserInfo",
                    data,
                    {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                            "cache-control": "no-cache",
                            "content-type": "application/x-www-form-urlencoded",
                            "pragma": "no-cache",
                            "priority": "u=1, i",
                            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site",
                            "cookie": user_session.login_ui_cookie,
                            "Referer": "https://cdns.eu1.gigya.com/",
                            "Referrer-Policy": "strict-origin-when-cross-origin",
                            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
                        }
                    }
                ),
                3,
                2,
                RetryStategy.ConstBackoff
            )
            // if (response.data as any)['statusCode'] == 403
            return E.right(response.data)
        } catch(err) {
            return E.left(CambridgeAPIError.GetUserInfoFromGigyaError)
        }
    }
    getNewJSessionTokenFromOldSession = async (old_session: UserSessionInfo): Promise<E.Either<CambridgeAPIError, string>> => {
        const userInfo = await this.getUserInfo(old_session)
        if (E.isLeft(userInfo)) {
            return userInfo
        }
        const sessionToken = await this._getSessionFromLoginTokenAndSignatureID(old_session.login_token, userInfo.right, userInfo.right.signatureTimestamp)
        if (E.isLeft(sessionToken)) {
            return sessionToken
        }
        return sessionToken
    }

    _getSessionFromLoginTokenAndSignatureID = async (loginToken: string, userInfo: UserInfo, signature_timestamp: number): Promise<E.Either<CambridgeAPIError, string>> => {
        try {
            const response = await retry(
            () => 
                axios.get<string>(`${CAMBRIDGE_DICTIONARY_HOST}/auth/gauth/save?UUID=${userInfo.UID}&timestamp=${signature_timestamp}&UIDSignature=${encodeURIComponent(userInfo.UIDSignature)}&remember=false`, {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": `${CAMBRIDGE_COOKIE_GIGYA_VER_KEY}=${CAMBRIDGE_COOKIE_GIGYA_VER_VALUE}; ${CAMBRIDGE_LOGIN_TOKEN_COOKIE_KEY}=${loginToken}`,
                        "Referrer-Policy": "strict-origin-when-cross-origin",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
                    },
                }),
                3,
                2,
                RetryStategy.ConstBackoff
            )
            const cookieParsed = cookie.parse(response.headers["set-cookie"]!.join(';'))["JSESSIONID"]
            if (cookieParsed) {
                return E.right(cookieParsed)
            } else
                return E.left(CambridgeAPIError.CantGetSessionTokenFromSetCookie)
        } catch(err) {
            return E.left(CambridgeAPIError.GetSessionTokenError)
        }
        
    }



    _fetchWordListMetadata = async (loginToken: string, sessionToken: string): Promise<E.Either<CambridgeAPIError, Array<WordListMetadata>>> => {
        try {
            const res = await retry(() => axios.get<Array<WordListMetadata>>(`${CAMBRIDGE_DICTIONARY_HOST}/vi/plus/myWordlists/getWordlists?page=1`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
                    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": `hasloggedin=1; JSESSIONID=${sessionToken}`,
                    "Referer": `${CAMBRIDGE_DICTIONARY_HOST}/vi/plus/myWordlists`,
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
                },
            }), 3, 2, RetryStategy.LinearBackoff)
            if (res.data.toString() == "") {
                return E.left(CambridgeAPIError.WordListMetadataEmptyString)
            }
            return E.right(res.data)
        } catch {
            return E.left(CambridgeAPIError.UnknownFetchWordListMetadatasError)
        }
        
    }

    fetchWordListMetadata = async (loginToken: string, sessionToken: string): Promise<E.Either<CambridgeAPIError, Array<WordListMetadata>>> => {
        const result = await this._fetchWordListMetadata(loginToken, sessionToken)
        return result
    }


    fetchWordListDetail = async (sessionToken: string, wordListMetadata: WordListMetadata): Promise<E.Either<CambridgeAPIError, Array<WordMetadata>>> => {
        const totalPage = !wordListMetadata.count ? 0 : (wordListMetadata.count - 1)/WORDLIST_WORD_PER_PAGE
        const wordMetadatas: Array<WordMetadata> = []
        for (let i = 0; i < totalPage; i++) {
            const res = await this._fetchWordListPage(sessionToken, wordListMetadata, i)
            if (E.isLeft(res)) {
                return res
            } else {

                wordMetadatas.push(...res.right)
            }
        }
        return E.right(wordMetadatas)
    }

    _fetchWordListPage = async (session_token: string, wordListMetadata: WordListMetadata, pageNumber: number): Promise<E.Either<CambridgeAPIError, Array<WordMetadata>>> => {
        const response = await retry(() => axios.get<Array<WordMetadata>>(`${CAMBRIDGE_DICTIONARY_HOST}/vi/plus/wordlist/${wordListMetadata.id}/entries/${pageNumber}/`, {
            "headers": {
              "accept": "*/*",
              "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
              "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-requested-with": "XMLHttpRequest",
              "cookie": `JSESSIONID=${session_token}`,
              "Referer": "https://dictionary.cambridge.org/vi/plus/wordlist/78693196_ielts-2",
              "Referrer-Policy": "strict-origin-when-cross-origin",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
            },
          }), 3, 2, RetryStategy.LinearBackoff)
        return E.right(response.data)
    }

    fetchWordDetail = async (headword: string): Promise<E.Either<CambridgeAPIError, Array<Word>>> => {
        let response: AxiosResponse<string>;
        try {
            response = await retry(() => axios.get<string>(`${CAMBRIDGE_DICTIONARY_HOST}/vi/dictionary/english/${headword}`, {
                "headers": {
                  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                  "accept-language": "vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                  "cache-control": "no-cache",
                  "pragma": "no-cache",
                  "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "document",
                  "sec-fetch-mode": "navigate",
                  "sec-fetch-site": "none",
                  "sec-fetch-user": "?1",
                  "upgrade-insecure-requests": "1",
                  "cookie": "preferredDictionaries=\"english,british-grammar,english-french,french-english\"",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
                },
              }), 3, 2, RetryStategy.LinearBackoff);
        } catch(e) {
            logger.error(`Error when fetching http request of headword ${headword}. Error: ${e}`)
            return E.left(CambridgeAPIError.FetchWordDetailUnknownError)
        }
        if (response.status == 302) {
            logger.error(`Got redirect when request headword ${headword}`)
            return E.left(CambridgeAPIError.FetchWordDetailNotFoundError)
        }

        try {
            return E.right(this.wordParser.parser(response.data))
        } catch(e) {
            logger.error(`Error when parsing data to get Array<Word> for headword ${headword}`)
            return E.left(CambridgeAPIError.ParseWordDetailError)
        }
    }
}

export {
    ICambridgeAPI,
    CambridgeAPIImpl,
    CambridgeAPIError,
    CambridgeLoginUserResponse,
    Word,
    ICambridgeWordParser
}


// headword: document.querySelectorAll(".headword")[0]
// pronounciation UK: $(".uk.dpron-i .ipa")[0].innerText
// pronounciation US: $(".us.dpron-i .ipa")[0].innerText
// pos: $(".pos.dpos")
// meaning: $(".def.ddef_d.db")[0]
// example: $(".examp.dexamp")
// extended_example: $("#dataset-example .deg")
