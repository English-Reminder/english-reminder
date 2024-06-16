import { App } from '@slack/bolt'
import { parse } from 'cookie'
const app = new App({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  port: 3000
});


/* Add functionality here */

(async () => {
  console.log(process.env.CLIENT_ID)
  // Start the app
  await app.start();
  app.command('/echo', async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log(command);
    await respond({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "New Paid Time Off request from <example.com|Fred Enriquez>\n\n<https://example.com|View request>"
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "plain_text_input-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Label",
            "emoji": true
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "plain_text_input-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Label",
            "emoji": true
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            },
            {
              "type": "plain_text",
              "text": "*this is plain_text text*",
              "emoji": true
            }
          ]
        }
      ]
    });
    
  });
  // app.client.chat.postMessage()
    // fetch("https://dictionary.cambridge.org/auth/info?rid=amp-BCLIUka9lCusiXudcZyNwA&url=https%3A%2F%2Fdictionary.cambridge.org%2Fplus%2FmyWordlists&ref=https%3A%2F%2Fdictionary.cambridge.org%2Fplus%2F&type=PLUS_WORDLISTS_PERSO&v1=&v2=&v3=&v4=wordlists&v5=&v6=personal&v7=&v8=&_=0.06325903370011199&__amp_source_origin=https%3A%2F%2Fdictionary.cambridge.org", {
    //   "headers": {
    //     "accept": "application/json",
    //     "accept-language": "vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
    //     "amp-same-origin": "true",
    //     "cache-control": "no-cache",
    //     "pragma": "no-cache",
    //     "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    //     "sec-ch-ua-mobile": "?0",
    //     "sec-ch-ua-platform": "\"Windows\"",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "cookie": "XSRF-TOKEN=4df0eb4f-b3da-459c-b263-d10f1101b568; gig_canary=false; gig_bootstrap_4_5rnY1vVhTXaiyHmFSwS_Lw=_gigya_ver4; iawppid=cc470a8987a84725aca4e6b0c5f97aa7; iawpvc1m=1; loginPopup=1; _sp_ses.7ecc=*; iawsc1m=1; amp-access=amp-BCLIUka9lCusiXudcZyNwA; _ga=GA1.3.1901434307.1718441090; _sharedID=bddaa8d8-809b-4ed8-9079-92a12ea1f5b8; _sharedID_cst=zix7LPQsHA%3D%3D; _hjSession_2790984=eyJpZCI6IjA5YWE0ZDJjLTE1ZjAtNDYxNC04Yjc1LTQ4Njc2MjQxMTM5NiIsImMiOjE3MTg0NDEwODk2NjAsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; _hjHasCachedUserAttributes=true; preferredDictionaries=\"english,british-grammar,english-french,french-english\"; FCNEC=%5B%5B%22AKsRol8QSiPgLG-Y1rqIBdr08E9JxrmkklF6nm2dfzo5JfLIvfZ1HbCnOug08tEa7OdVlwrHDmQmKp3EA-5gUrlfi0b0aRINLiEO1nXlyBI--GXCqLoNqhAC-y1-4vjpqc1H_LYRQp8o59s4xeDtNmKdE0AHirmlow%3D%3D%22%5D%5D; __gads=ID=b85ff42f281535b9:T=1718438451:RT=1718441091:S=ALNI_MbuiruFaTUmto-4vBF9kgbLBWcHag; __gpi=UID=00000e4d127bf812:T=1718438451:RT=1718441091:S=ALNI_MbYoA-ExQdauvbVpQ1pGhJ312nm4A; __eoi=ID=16ff865cb6478974:T=1718438451:RT=1718441091:S=AA-AfjaN1kqJbY2qZvUxISx0bWb7; _lr_retry_request=true; _lr_env_src_ats=false; pbjs-unifiedid=%7B%22TDID%22%3A%224080f5a2-fd20-4a9e-9766-9899684cad08%22%2C%22TDID_LOOKUP%22%3A%22FALSE%22%2C%22TDID_CREATED_AT%22%3A%222024-06-15T08%3A44%3A54%22%7D; pbjs-unifiedid_cst=zix7LPQsHA%3D%3D; gig_canary_ver=15936-3-28640670; glt_4_5rnY1vVhTXaiyHmFSwS_Lw=st2.s.AtLtJ500Vw.4T3bsso21G3z6Et7BEIS9ru5BAKWMO75ZjMrL1aPcSjRXWbGefOuk-cks7XTcHBIrnWh3ay6E9GfjKTRTV8QM5XwyB7zfzV-T-p4Gzj-sb1Cfnl-QG_505m5sjJ0_HJE.322WSxk7eTrXuFKRsAgpGcK1F9Mq8IZWXqrSTr0_F9UcEM6RD8djHNin8E0oEhGvLVGDC8E3_f1pFSF7wjVscg.sc3; username=B%C3%A1ch+Tr%E1%BA%A7n+Xu%C3%A2n; logged=logged; hasloggedin=1; JSESSIONID=D95CBFDED9009CF96FFD5B07AE007B27-n1; beta-redesign=active; iawpvccs=2; iawpvc=2; iawpvtc1m=2; _hjSessionUser_2790984=eyJpZCI6ImY1OTFhYjRlLWIwNDgtNTM4ZS1hODY5LWYzNGRhN2QzZjcxOSIsImNyZWF0ZWQiOjE3MTg0NDEwODk2NTksImV4aXN0aW5nIjp0cnVlfQ==; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Jun+15+2024+15%3A45%3A11+GMT%2B0700+(Indochina+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false; OptanonAlertBoxClosed=2024-06-15T08:45:11.360Z; _ga_L9GCR21SZ7=GS1.3.1718441089.1.1.1718441112.37.0.0; cto_bundle=O4VRv19mRiUyQnphMDRUSWxyUW1TaEdRbEcyYlh6ZEp2blhGU0JjSkw2ekgwJTJGNHFIcmElMkIlMkY3NE5XeHg4SEVDRHFNQ3pGUHNnRHJtb1lucFNjT0FwZVRjd0ElMkZvVHhmaUhXbHBFMndiaG9oZk5zSU41b24ycEtLbHQ2VUw5dVZTWnpvVzZZejhwZnVTZWJ4JTJGTTNSY2xvVEdUNzZ5S0ElM0QlM0Q; cto_bidid=ihv8L19CSVhUZUVhUFh2RkdUckRhTWszV0hkbjNzQWRFSTRqJTJCT21PN0FlU3VYcUhYTHVNSXVBJTJGJTJCbzdiZG96WFQ1NTFadFd3YiUyQllJY0NTVFZmTVo5Z01YdnZCVjR3TjFqck9Qc1dQZTloMkUwbHNRJTNE; cto_dna_bundle=aDngNF9mRiUyQnphMDRUSWxyUW1TaEdRbEcyYlJqOGdieEdGbTRPZWI3V0pKNEZLMHN3UTFPa05Qbzd5ZzVLSDlwN0pFV0s3S2JGSyUyRnBJUnV6REdWRDJkRldvUEElM0QlM0Q; _sp_id.7ecc=1650a3f1-1009-4e5b-945d-a3b3f9325da8.1718438423.130.1718441120.1718438483.a6239330-e8c6-4140-bfd1-579f6ade48ea..1ccc4a00-2fa7-48c6-9f13-00efdf264485.1718441089324.5",
    //     "Referer": "https://dictionary.cambridge.org/plus/myWordlists",
    //     "Referrer-Policy": "strict-origin-when-cross-origin"
    //   },
    //   "body": null,
    //   "method": "GET"
    // }).then(res => res.json().then(res => console.log));

    // let res = await fetch("https://accounts.eu1.gigya.com/accounts.getAccountInfo", {
    //   "headers": {
    //     "accept": "*/*",
    //     "accept-language": "vi,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
    //     "cache-control": "no-cache",
    //     "content-type": "application/x-www-form-urlencoded",
    //     "pragma": "no-cache",
    //     "priority": "u=1, i",
    //     "sec-ch-ua": "\"Microsoft Edge\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    //     "sec-ch-ua-mobile": "?0",
    //     "sec-ch-ua-platform": "\"Windows\"",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-site",
    //     "cookie": "gmid=gmid.ver4.AtLtEuUTFA.yoD5rTzQ0DpD_GaL7kcyogtwTDVO9xnwGS3z7i-ejISG9YAEo3R3BEntqHrYTFzC.J1KvsWePT_YScABl-E84zdaFuP8PKZ5efc3TkDBCLLW5k4XqiIQEicnes5FFpjA0nZrw-y9eYISv_T1aMPHE_Q.sc3; ucid=7OG7YpDChz3oJi7GRMu0OA; hasGmid=ver4",
    //     "Referer": "https://cdns.eu1.gigya.com/",
    //     "Referrer-Policy": "strict-origin-when-cross-origin"
    //   },
    //   "body": "include=profile%2Cdata%2C&lang=en&APIKey=4_5rnY1vVhTXaiyHmFSwS_Lw&cid=CDO&sdk=js_latest&login_token=st2.s.AtLttJMZBQ.Pr_1wbWTjwL1Z8TWO2DFo5JE0QkJkK8oNxTu02NuyKZhJC_9BnhayVh-ai_zgYZOohkP2OiIWRI6ptE69RLYxrxJu0WFbwX8w6rZ_Kutqp5sKLnB8PdGnLdtPOhYS8eN.OzkMnovMVB4BTi0VWuzMweqgKwzszI2QGYytChFjA942Z3m_-Uzfav53QT5mqC4Dlk4gzXVnrKUeSmkLqnztCw.sc3&authMode=cookie&pageURL=https%3A%2F%2Fdictionary.cambridge.org%2F&sdkBuild=15936&format=json",
    //   "method": "POST"
    // });
    // console.log(await res.json())

    let res = await fetch("https://dictionary.cambridge.org/auth/gauth/save?UUID=e4bd3382718f47f8a6f02c08d167487a&timestamp=1718445257&UIDSignature=uBb4%2FxVzVuf%2BsmnX00gPDj8AzNw%3D&remember=false", {
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
        "cookie": "XSRF-TOKEN=3e68fa29-9ef5-408e-813b-e76cc04cc080; preferredDictionaries=\"english,british-grammar,english-french,french-english\"; beta-redesign=active; _sp_ses.7ecc=*; _sharedID=7a6584ab-6c31-4025-a475-6e5428c92ed6; _sharedID_cst=zix7LPQsHA%3D%3D; amp-access=amp-BCLIUka9lCusiXudcZyNwA; _hjSession_2790984=eyJpZCI6IjM1M2UxMmNlLTUzMmYtNGUzNS1iN2M4LWFiNGE5MGRjNjI5NSIsImMiOjE3MTg0NDQwMTAyODMsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjoxLCJzcCI6MH0=; _hjHasCachedUserAttributes=true; _ga=GA1.3.300850729.1718444010; iawppid=3637b4cf94814d5e857fb769bbefff29; iawpvc1m=1; _lr_retry_request=true; _lr_env_src_ats=false; pbjs-unifiedid=%7B%22TDID%22%3A%227e73d5c2-d584-4d27-abbf-b54c592e6dcf%22%2C%22TDID_LOOKUP%22%3A%22FALSE%22%2C%22TDID_CREATED_AT%22%3A%222024-06-15T09%3A33%3A34%22%7D; pbjs-unifiedid_cst=zix7LPQsHA%3D%3D; gig_canary=false; gig_bootstrap_4_5rnY1vVhTXaiyHmFSwS_Lw=_gigya_ver4; username=B%C3%A1ch+Tr%E1%BA%A7n+Xu%C3%A2n; logged=logged; _hjSessionUser_2790984=eyJpZCI6ImMwMjNiNDkwLTRiZWEtNTc4ZC04ZDJjLTkzMDFlMjg5N2ZlZiIsImNyZWF0ZWQiOjE3MTg0NDQwMTAyODIsImV4aXN0aW5nIjp0cnVlfQ==; JSESSIONID=52A04BA7F89CAA6333D91C40619CD7E0-n1; gig_canary_ver=15936-3-28640745; iawpvccs=1; iawsc1m=1; iawpvc=4; iawpvtc1m=4; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Jun+15+2024+16%3A49%3A58+GMT%2B0700+(Indochina+Time)&version=202402.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&AwaitingReconsent=false&geolocation=VN%3BHN; OptanonAlertBoxClosed=2024-06-15T09:49:58.335Z; FCNEC=%5B%5B%22AKsRol_awgCeXAvEtjVvsjzUyKQ8hl_JYPpi77h2vqLAHl5fLgH2uW1tUK06F_jtpnI1IRaDAiiJp8pa8WBBP3zZ2maPO108U1k67yUw8qdDoYWfGnqI55YnVy53meoxvV_twA2JnYpJAu9pp7dvlExj2sY59nmxwA%3D%3D%22%5D%5D; __gads=ID=3996818fd631388a:T=1718444011:RT=1718445000:S=ALNI_MY2qGnb9cNV3CC4UdMU9oR8Yh2pAg; __gpi=UID=00000e4ea2144697:T=1718444011:RT=1718445000:S=ALNI_MaezDRRNFdGtYXbtwn305bQBlUvNA; __eoi=ID=32e6f21f0ee0b3d2:T=1718444011:RT=1718445000:S=AA-AfjaRzf4UyxZvskxztRyvkZ13; cto_bundle=xja9cV9mRiUyQnphMDRUSWxyUW1TaEdRbEcyYlYyVXkzMkNVbUhleG5adkRMaXdVRTZpJTJGWGc4VXJFNDJkUVBNUGJVRTdoNWFZOE9zSkdKRVUwSjBzMndrOXQxRGh6OHNpJTJCbFhOd014VzZIdnl3SU16aklWV3l1TlRqSEtMR3BlRGlLOWJka0FvcnJJZHptaFdZY0VVeWRXJTJCVWZCZyUzRCUzRA; cto_bidid=5kBpTV9CSVhUZUVhUFh2RkdUckRhTWszV0hkbjNzQWRFSTRqJTJCT21PN0FlU3VYcUhYTHVNSXVBJTJGJTJCbzdiZG96WFQ1NTFaaCUyQlVldUltaWlBeTZ1QlhyRTBIS1c2MUtmc3FtdkowR1R4Rk5TeWVXeWprJTNE; cto_dna_bundle=2Ishjl9Nb3A5cVphazV2bjRvQkpmZzR1YjQlMkZMQ0xNVE1KaTQ1RHBtWUdSbnFHJTJGb0FMQVU5ZXVIbWNMVnVBYmF3RzFsOHFnajdqcVlRRWJJUGs4WWJzd0NEc1ElM0QlM0Q; _sp_id.7ecc=d7471d3b-a7da-4d47-b26f-0936a8fee915.1718444010.1.1718445158..45ec3f75-e9a2-4d1f-9581-83fe20e36688..5d1c31a8-618c-47b7-8648-a943a353e942.1718444009791.22; hasloggedin=0; _ga_L9GCR21SZ7=GS1.3.1718444010.1.1.1718445244.60.0.0; glt_4_5rnY1vVhTXaiyHmFSwS_Lw=st2.s.AtLtbfdZSA.duSfyh5ShhqUcCL8wNDMD0OaGrGSSZdHLFD2K_ggzTLxU8-Rk9roW7lg8Ho-aiw6F1yHd2RZMLgsIChokNZBIcW7pT0TKk_ZAbX292crfmGh9EGBFDeXkOHKppyKiyOi.rcXW8gY7dd8HrM9FqtZf0V5o9K-MXi0DhtZuFzaueqamlqKmHultd5MJgbiz-djPm-3mMYuiMzNDs_arNM3-lQ.sc3",
        "Referer": "https://dictionary.cambridge.org/auth/signin?rid=amp-BCLIUka9lCusiXudcZyNwA&return=https%3A%2F%2Fcdn.ampproject.org%2Fv0%2Famp-login-done-0.1.html%3Furl%3Dhttps%253A%252F%252Fdictionary.cambridge.org%252Fauth%252Fprofile",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });
    console.log(await res.json())
})()