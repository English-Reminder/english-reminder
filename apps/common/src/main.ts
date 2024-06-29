import axios from 'axios';
import { retry } from './retry'
import { CambridgeAPIImpl, CambridgeLoginUserResponse } from './cambridge/cambridge-api';
import * as E from 'fp-ts/Either'
import * as fs from 'fs'
import { scrapeWord } from './cambridge/cambridge-scrape';
import * as htmlminifier from 'html-minifier'
import { parse, HTMLElement } from 'node-html-parser';
(async function test () {
    const a = new CambridgeAPIImpl()

    // const b = await a.login("test@icloud.com", "test")
    // const c = b as E.Right<CambridgeLoginUserResponse>
    // const sessionInfo = c.right.sessionInfo
    // const sessionToken = await a.getNewJSessionTokenFromOldSession(sessionInfo)
    // console.log(sessionToken)
    
    
    // const sessionToken = await a._getSessionFromLoginTokenAndSignatureID(c.right.sessionInfo.login_token, c.right.userInfo, c.right.userInfo.signatureTimestamp)
    // console.log(sessionToken)
    // if (E.isRight(sessionToken))
    //     console.log(await a.fetchWordListMetadata(c.right.sessionInfo.login_token, sessionToken.right))

    // a.fetchWordDetail("take")
    
    const data = fs.readFileSync('/Users/bach_tx/Desktop/self/english-reminder/english-reminder/apps/common/src/TAKE _ English meaning - Cambridge Dictionary.html', 'utf-8')
    const result = htmlminifier.minify(data, {

    });
    // const test = `<div class="def ddef_d db">to <a class="query" href="https://dictionary.cambridge.org/dictionary/english/remove" title="remove" rel="">remove</a> something, <a class="query" href="https://dictionary.cambridge.org/dictionary/english/especially" title="especially" rel="">especially</a> without <a class="query" href="https://dictionary.cambridge.org/dictionary/english/permission" title="permission" rel="">permission</a>: </div>`
    // const parsed = parse(test)
    // parsed.textContent
    const e = scrapeWord(result)
    console.log(e)
}())


// fetch("https://dictionary.cambridge.org/auth/info?rid=amp-SffdHoak3uO5fG-fMtyeDg&url=https%3A%2F%2Fdictionary.cambridge.org%2Fplus%2FmyWordlists&ref=https%3A%2F%2Fdictionary.cambridge.org%2Fplus%2F&type=PLUS_WORDLISTS_PERSO&v1=&v2=&v3=&v4=wordlists&v5=&v6=personal&v7=&v8=&_=0.8023414866494447&__amp_source_origin=https%3A%2F%2Fdictionary.cambridge.org", {
//   "headers": {
//     "accept": "application/json",
//     "accept-language": "en-US,en;q=0.9",
//     "amp-same-origin": "true",
//     "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "cookie": "amp-access=amp-SffdHoak3uO5fG-fMtyeDg; preferredDictionaries=\"english,british-grammar,english-french,french-english\"; _fbp=fb.1.1718483145793.394356217721780740; _sharedID=c0fced2f-0ab8-4fc1-9280-32655c0f6575; _sharedID_cst=zix7LPQsHA%3D%3D; _ga=GA1.3.1161354490.1718483147; iawppid=000cb544418b4b2480ef17cd98be6378; iawpvc1m=1; _lr_env_src_ats=false; pbjs-unifiedid=%7B%22TDID%22%3A%22df3e259b-7414-4726-a767-04cc6b628516%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222024-05-15T20%3A25%3A51%22%7D; pbjs-unifiedid_cst=zix7LPQsHA%3D%3D; gig_bootstrap_4_5rnY1vVhTXaiyHmFSwS_Lw=_gigya_ver4; glt_4_5rnY1vVhTXaiyHmFSwS_Lw=st2.s.AtLtHNbDsw.0Ddj5jw1pHdQ-rnFBzYuS9iAJDVCWKer46OjIEPqsM81eGGzOjZC2vbhu25iGOlDukujBBA30r4VVjQWDCP3Y16Ll0JtchgYJqwzaJZqmtKsm-RUUW1r98_l0i2y9JMK.tOIx_R1OjYE3FuM9_hHGKEavj_k4NS1OWQ0RTbQMjWwEfa_E5zCShQrKh_90Ro5QXnAApSL9WTth0J9tokel-g.sc3%7CUUID%3D6178aadd83514cd3bfa906f31361fc44; _gig_llp=apple; _gig_llu=B%C3%A1ch; hasloggedin=1; _hjSessionUser_2790984=eyJpZCI6ImI5OGE5MmNjLTQxZGUtNTIyMS04YjYyLWNkNGU3OGUwOTMwNiIsImNyZWF0ZWQiOjE3MTg0ODMxNDU5NTksImV4aXN0aW5nIjp0cnVlfQ==; XSRF-TOKEN=1def630d-ae72-439e-92c7-7023e02f952e; gig_canary=false; _hjHasCachedUserAttributes=true; username=B%C3%A1ch+Tr%E1%BA%A7n+Xu%C3%A2n; logged=logged; JSESSIONID=E715A1F023139EFFB80A607A59024F0C-n1; gig_canary_ver=16081-3-28643655; _sp_ses.7ecc=*; iawsc1m=6; _hjSession_2790984=eyJpZCI6IjY4Y2QyYjU2LWY3ZGQtNDI4Yy1hMjNlLTg2NjdhN2RjN2JhMCIsImMiOjE3MTg2MTkyMDg0NjMsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; FCNEC=%5B%5B%22AKsRol96UYn1GcF0uSOVHmC2wVG74gfHQJdV0pH3P8U9Lzj8C1Wa7KBktjNzKC1BgxgqrgA5R3EjideqeGZdmr2qx-tlseeV2yBiRtjxzuPTjIz18hEHKnkZv73rxWCUsQ-Q1OKoKbUBa4I3gheUwqOAxMVGRo3wjA%3D%3D%22%5D%5D; __gads=ID=fd550171644d09da:T=1718483147:RT=1718619210:S=ALNI_MZITHSIzgndsD4vrfiKJmqRiQGqXw; __gpi=UID=00000e4eecf7987c:T=1718483147:RT=1718619210:S=ALNI_MYgj1vzdrn4AZkcZ4MovOYj_-rwGQ; __eoi=ID=ab27e9f3a73007d7:T=1718483147:RT=1718619210:S=AA-Afjah_qMuLLLMkdgPCYDnj42v; _lr_retry_request=true; beta-redesign=active; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jun+17+2024+17%3A13%3A58+GMT%2B0700+(Indochina+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&geolocation=VN%3BHN&AwaitingReconsent=false; OptanonAlertBoxClosed=2024-06-17T10:13:58.088Z; _sp_id.7ecc=.1718483146.2.1718619238.1718483897.ca6234c4-8a2b-4202-999b-4df70d764fff..df77a355-3159-4192-8884-23d6b2d48d18.1718619208144.7; iawpvccs=3; iawpvc=8; iawpvtc1m=8; _ga_L9GCR21SZ7=GS1.3.1718619209.2.1.1718619241.28.0.0; cto_bundle=-4GVC19mWldoVFY5alJ6dEhOODI4NndOT2JPVlNzcUxPMGFiUmJsV0V1SnJJUVFsVkxTYkVpSDYyZnFyMjdRdlQ2QU1NUjRVUmIlMkZVRjBZMWdvRnVyUGpXNFR1RTRiU3oxJTJCMkdyWG1FJTJCRVBKM1l0MnBDTnBKMjM3VmdvenF6Z3FXcUpXVDdsQ0ZYbkl5Y2dEN0l4N0FIWVgyNGRCSiUyRlRnSG5KRWklMkJLMEV6dmhSdG1kYnZrWkdyNEp0T2ZlYzVXMzRRMmg5JTJCbFNVRTUlMkJ6amZYbnFYeFN5YW1lOEElM0QlM0Q; cto_bidid=HWOtmF8lMkJIYyUyRmROaVhZZnF2U3RBYmNLSmd0VHFpQVIxQ2dSZTNkcHRtOVljZWhNNHFWOW1Kek14RkZ6Rk1XYndwbnczczlMblFEaHhrcTgyTkNiQzdiRlZ2JTJCMDdUbER3SmRUeWFVbGdxS0tkdSUyRkpHQTBXQ2dEJTJCVWcwa29sVk5lYTVzNVpoQlJobUtpSEtXOUNTdnQ1WEVLTTdRJTNEJTNE",
//     "Referer": "https://dictionary.cambridge.org/plus/myWordlists",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });


// fetch("https://dictionary.cambridge.org/plus/myWordlists/getWordlists?page=1", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-requested-with": "XMLHttpRequest",
//     "cookie": "amp-access=amp-SffdHoak3uO5fG-fMtyeDg; preferredDictionaries=\"english,british-grammar,english-french,french-english\"; _fbp=fb.1.1718483145793.394356217721780740; _sharedID=c0fced2f-0ab8-4fc1-9280-32655c0f6575; _sharedID_cst=zix7LPQsHA%3D%3D; _ga=GA1.3.1161354490.1718483147; iawppid=000cb544418b4b2480ef17cd98be6378; iawpvc1m=1; _lr_env_src_ats=false; pbjs-unifiedid=%7B%22TDID%22%3A%22df3e259b-7414-4726-a767-04cc6b628516%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222024-05-15T20%3A25%3A51%22%7D; pbjs-unifiedid_cst=zix7LPQsHA%3D%3D; gig_bootstrap_4_5rnY1vVhTXaiyHmFSwS_Lw=_gigya_ver4; glt_4_5rnY1vVhTXaiyHmFSwS_Lw=st2.s.AtLtHNbDsw.0Ddj5jw1pHdQ-rnFBzYuS9iAJDVCWKer46OjIEPqsM81eGGzOjZC2vbhu25iGOlDukujBBA30r4VVjQWDCP3Y16Ll0JtchgYJqwzaJZqmtKsm-RUUW1r98_l0i2y9JMK.tOIx_R1OjYE3FuM9_hHGKEavj_k4NS1OWQ0RTbQMjWwEfa_E5zCShQrKh_90Ro5QXnAApSL9WTth0J9tokel-g.sc3%7CUUID%3D6178aadd83514cd3bfa906f31361fc44; _gig_llp=apple; _gig_llu=B%C3%A1ch; hasloggedin=1; _hjSessionUser_2790984=eyJpZCI6ImI5OGE5MmNjLTQxZGUtNTIyMS04YjYyLWNkNGU3OGUwOTMwNiIsImNyZWF0ZWQiOjE3MTg0ODMxNDU5NTksImV4aXN0aW5nIjp0cnVlfQ==; XSRF-TOKEN=1def630d-ae72-439e-92c7-7023e02f952e; gig_canary=false; _hjHasCachedUserAttributes=true; username=B%C3%A1ch+Tr%E1%BA%A7n+Xu%C3%A2n; logged=logged; JSESSIONID=E715A1F023139EFFB80A607A59024F0C-n1; gig_canary_ver=16081-3-28643655; _sp_ses.7ecc=*; iawsc1m=6; _hjSession_2790984=eyJpZCI6IjY4Y2QyYjU2LWY3ZGQtNDI4Yy1hMjNlLTg2NjdhN2RjN2JhMCIsImMiOjE3MTg2MTkyMDg0NjMsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; FCNEC=%5B%5B%22AKsRol96UYn1GcF0uSOVHmC2wVG74gfHQJdV0pH3P8U9Lzj8C1Wa7KBktjNzKC1BgxgqrgA5R3EjideqeGZdmr2qx-tlseeV2yBiRtjxzuPTjIz18hEHKnkZv73rxWCUsQ-Q1OKoKbUBa4I3gheUwqOAxMVGRo3wjA%3D%3D%22%5D%5D; __gads=ID=fd550171644d09da:T=1718483147:RT=1718619210:S=ALNI_MZITHSIzgndsD4vrfiKJmqRiQGqXw; __gpi=UID=00000e4eecf7987c:T=1718483147:RT=1718619210:S=ALNI_MYgj1vzdrn4AZkcZ4MovOYj_-rwGQ; __eoi=ID=ab27e9f3a73007d7:T=1718483147:RT=1718619210:S=AA-Afjah_qMuLLLMkdgPCYDnj42v; _lr_retry_request=true; beta-redesign=active; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Jun+17+2024+17%3A13%3A58+GMT%2B0700+(Indochina+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&geolocation=VN%3BHN&AwaitingReconsent=false; OptanonAlertBoxClosed=2024-06-17T10:13:58.088Z; _sp_id.7ecc=.1718483146.2.1718619238.1718483897.ca6234c4-8a2b-4202-999b-4df70d764fff..df77a355-3159-4192-8884-23d6b2d48d18.1718619208144.7; iawpvccs=3; iawpvc=8; iawpvtc1m=8; _ga_L9GCR21SZ7=GS1.3.1718619209.2.1.1718619241.28.0.0; cto_bundle=-4GVC19mWldoVFY5alJ6dEhOODI4NndOT2JPVlNzcUxPMGFiUmJsV0V1SnJJUVFsVkxTYkVpSDYyZnFyMjdRdlQ2QU1NUjRVUmIlMkZVRjBZMWdvRnVyUGpXNFR1RTRiU3oxJTJCMkdyWG1FJTJCRVBKM1l0MnBDTnBKMjM3VmdvenF6Z3FXcUpXVDdsQ0ZYbkl5Y2dEN0l4N0FIWVgyNGRCSiUyRlRnSG5KRWklMkJLMEV6dmhSdG1kYnZrWkdyNEp0T2ZlYzVXMzRRMmg5JTJCbFNVRTUlMkJ6amZYbnFYeFN5YW1lOEElM0QlM0Q; cto_bidid=HWOtmF8lMkJIYyUyRmROaVhZZnF2U3RBYmNLSmd0VHFpQVIxQ2dSZTNkcHRtOVljZWhNNHFWOW1Kek14RkZ6Rk1XYndwbnczczlMblFEaHhrcTgyTkNiQzdiRlZ2JTJCMDdUbER3SmRUeWFVbGdxS0tkdSUyRkpHQTBXQ2dEJTJCVWcwa29sVk5lYTVzNVpoQlJobUtpSEtXOUNTdnQ1WEVLTTdRJTNEJTNE",
//     "Referer": "https://dictionary.cambridge.org/plus/myWordlists",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });


// fetch("https://accounts.eu1.gigya.com/accounts.webSdkBootstrap?apiKey=4_5rnY1vVhTXaiyHmFSwS_Lw&pageURL=https%3A%2F%2Fdictionary.cambridge.org%2F&sdk=js_latest&sdkBuild=15936&format=json", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"macOS\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-site",
//     "cookie": "ucid=o9Qv6aMFcfI_rwcRqBlJ9w; gig3pctest=true",
//     "Referer": "https://cdns.eu1.gigya.com/",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": null,
//   "method": "GET"
// });