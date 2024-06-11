import axios, { AxiosResponse } from "axios"
import { retry, RetryStategy } from "../retry"
import {CAMBRIDGE_LOGIN_HOST, CAMBRIDGE_LOGIN_PORT_PATH, CAMBRIDGE_LOGIN_UI_PATH} from "./cambridge-constant"
import { parse } from 'cookie'
import { stringify } from "qs"
interface CambridgeAPI {
    login: (username: string, password: string) => Promise<CambridgeLoginUserResponse|CambridgeAPIError>
    fetchWordListMetadata: (cookie: Map<string, string>) => BigInteger
    fetchWordListDetail: (cookie: Map<string, string>, wordListId: BigInteger) => BigInteger
}

enum CambridgeAPIError {
    GetCookieFromUIError,
    InvalidUsernameOrPasswordError,
    UnknownLoginError
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

}

interface UserSessionInfo {
    login_token: string,
    expires_in: string
}
interface CambridgeLoginUserResponse extends CambridgeLoginSimpleResponse{
    profile: Profile,
    sessionInfo: UserSessionInfo,
    userInfo: UserInfo,
    verifiedTimestamp: number
}



const COOKIE_NEEDED = ["gmid", "ucid", "hasGmid"]
class CambridgeAPIImpl implements CambridgeAPI {
    _getUILoginCookie = async () => {
        try {
            const response = await retry(() => axios.get(`${CAMBRIDGE_LOGIN_HOST}/${CAMBRIDGE_LOGIN_UI_PATH}`, {
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
                }
            }), 3, 1, RetryStategy.ExponentialBackOff)
            return COOKIE_NEEDED.map(key => `${key}=${parse(response.headers["set-cookie"].join(';'))[key]}`).join("; ")
        } catch (err) {
            return CambridgeAPIError.GetCookieFromUIError
        }
    }
    _loginUsingCookie = async (username: string, password: string, cookieStr: string) => {
        try {
            const response: AxiosResponse<CambridgeLoginSimpleResponse> = await retry(() => {
                console.log(`${CAMBRIDGE_LOGIN_HOST}/${CAMBRIDGE_LOGIN_PORT_PATH}`)
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
                    sdkBuild: 15936,
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
                    // validateStatus: function (status) {
                    //     return status == 200 || status == 403
                    // },
                
                })
            }, 3, 2, RetryStategy.ConstBackoff)
            return response.data
        } catch(err) {
            return CambridgeAPIError.UnknownLoginError
        }
    }
    login = async (username: string, password: string) => {
        const cookieString = await this._getUILoginCookie();
        if (cookieString == CambridgeAPIError.GetCookieFromUIError) {
            return cookieString
        }

        const loginInfo = await this._loginUsingCookie(username, password, cookieString)
        if (loginInfo == CambridgeAPIError.UnknownLoginError) {
            return loginInfo
        }
        if (loginInfo.errorCode == 403) {
            return CambridgeAPIError.InvalidUsernameOrPasswordError   
        }
        const _loginInfo = loginInfo as CambridgeLoginUserResponse;
        console.log(_loginInfo.sessionInfo.login_token)
        return _loginInfo

    }
    fetchWordListMetadata: (cookie: Map<string, string>) => Uint8Array
    fetchWordListDetail: (cookie: Map<string, string>, wordListId: BigInteger) => Uint8Array
}

export {
    CambridgeAPI,
    CambridgeAPIImpl,
    CambridgeAPIError
}