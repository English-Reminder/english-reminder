import axios, { AxiosResponse } from "axios"
import { retry, RetryStategy } from "../retry"
import {CAMBRIDGE_API_KEY, CAMBRIDGE_DICTIONARY_HOST, CAMBRIDGE_LOGIN_HOST, CAMBRIDGE_LOGIN_PORT_PATH, CAMBRIDGE_LOGIN_UI_PATH, CAMBRIDGE_SDK_BUILD} from "./cambridge-constant"
import * as cookie from 'cookie'
import { stringify } from "qs"
import logger  from "../logger"
import * as E from 'fp-ts/Either'
import { pipe } from "fp-ts/lib/function"

interface CambridgeAPI {
    login: (username: string, password: string) => Promise<E.Either<CambridgeAPIError, CambridgeLoginUserResponse>>
    // fetchWordListMetadata: (cookie: Map<string, string>) => BigInteger
    fetchWordListDetail: (cookie: Map<string, string>, wordListId: BigInteger) => BigInteger
}

enum CambridgeAPIError {
    GetCookieFromUIError,
    InvalidUsernameOrPasswordError,
    UnknownLoginError,
    GetUserInfoFromGigyaError,
    GetSessionTokenError,
    CantGetSessionTokenFromSetCookie,
    UnauthorizedError
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
}

const COOKIE_NEEDED = ["gmid", "ucid", "hasGmid"]
class CambridgeAPIImpl implements CambridgeAPI {
    temp = ''
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
                this.temp = COOKIE_NEEDED.map(key => `${key}=${cookie.parse(response.headers["set-cookie"].join(';'))[key]}`).join("; ")
            return E.right(COOKIE_NEEDED.map(key => `${key}=${cookie.parse(response.headers["set-cookie"].join(';'))[key]}`).join("; "))
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
                axios.get<string>(`https://dictionary.cambridge.org/auth/gauth/save?UUID=${userInfo.UID}&timestamp=${signature_timestamp}&UIDSignature=${encodeURIComponent(userInfo.UIDSignature)}&remember=false`, {
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
                        "cookie": `gig_bootstrap_4_5rnY1vVhTXaiyHmFSwS_Lw=_gigya_ver4; glt_4_5rnY1vVhTXaiyHmFSwS_Lw=${loginToken}`,
                        "Referer": "https://dictionary.cambridge.org/vi/auth/signin?rid=amp-fkXV9TQQEJJSCtZbZqv7bA&return=https%3A%2F%2Fcdn.ampproject.org%2Fv0%2Famp-login-done-0.1.html%3Furl%3Dhttps%253A%252F%252Fdictionary.cambridge.org%252Fvi%252Fdictionary%252Fenglish%252Ffiat",
                        "Referrer-Policy": "strict-origin-when-cross-origin",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
                    },
                }),
                3,
                2,
                RetryStategy.ConstBackoff
            )
            const cookieParsed = cookie.parse(response.headers["set-cookie"].join(';'))["JSESSIONID"]
            if (cookieParsed) {
                return E.right(cookieParsed)
            } else
                return E.left(CambridgeAPIError.CantGetSessionTokenFromSetCookie)
        } catch(err) {
            return E.left(CambridgeAPIError.GetSessionTokenError)
        }
        
    }



    // fetchWordListMetadata: (loginToken: string, sessionToken) => Promise<E.Either<CambridgeAPIError, Array<WordListMetadata>>>
    fetchWordListDetail: (cookie: Map<string, string>, wordListId: BigInteger) => Uint8Array
}

export {
    CambridgeAPI,
    CambridgeAPIImpl,
    CambridgeAPIError,
    CambridgeLoginUserResponse
}