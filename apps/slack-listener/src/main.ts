import { App } from '@slack/bolt'
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
    // app.client.chat.postMessage()
  });
  const b = await fetch("https://accounts.eu1.gigya.com/accounts.webSdkBootstrap?apiKey=4_5rnY1vVhTXaiyHmFSwS_Lw&pageURL=https%3A%2F%2Fdictionary.cambridge.org%2F&sdk=js_latest&sdkBuild=15936&format=json", {
    "headers": {
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
    "body": null,
    "method": "GET"
  });
  // console.log(b.headers.get("Set-Cookie"))
  for (const key of b.headers.getSetCookie()) {
    console.log(key);
  }
  const a = 
  await fetch("https://accounts.eu1.gigya.com/accounts.login", {
    "headers": {
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
      "cookie": "hasGmid=ver4; gmid=gmid.ver4.AtLtjAB0bQ.ofB2pwHZ7LJb423tKpUbSKpmBDHaALvd8YWHh-c7uy5jdjb62crQIP7X3ud68Et3.W4lg2e-GUgTS9iwbS0D5lmFKRgYQ_IXcfa3J3lkPcqHrkwQ8O0H7jhTkLafkEpWSODD_IuuD82anYBzsQwmc0g.sc3; ucid=5JiPUh6n_txRAa45zI28uQ",
      "Referer": "https://cdns.eu1.gigya.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "loginID=tranxuanbach1%40icloud.com&password=bachxn2001&sessionExpiration=31536000&targetEnv=jssdk&include=profile%2Cdata%2Cemails%2Csubscriptions%2Cpreferences%2C&includeUserInfo=true&loginMode=standard&lang=en&riskContext=%7B%22b0%22%3A67191%2C%22b1%22%3A%5B211%2C369%2C209%2C131%5D%2C%22b2%22%3A6%2C%22b3%22%3A%5B%5D%2C%22b4%22%3A2%2C%22b5%22%3A1%2C%22b6%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F125.0.0.0%20Safari%2F537.36%20Edg%2F125.0.0.0%22%2C%22b7%22%3A%5B%7B%22name%22%3A%22PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chrome%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Chromium%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22Microsoft%20Edge%20PDF%20Viewer%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%2C%7B%22name%22%3A%22WebKit%20built-in%20PDF%22%2C%22filename%22%3A%22internal-pdf-viewer%22%2C%22length%22%3A2%7D%5D%2C%22b8%22%3A%2210%3A51%3A47%20AM%22%2C%22b9%22%3A-420%2C%22b10%22%3A%7B%22state%22%3A%22prompt%22%7D%2C%22b11%22%3Afalse%2C%22b12%22%3A%7B%22charging%22%3Atrue%2C%22chargingTime%22%3A0%2C%22dischargingTime%22%3Anull%2C%22level%22%3A1%7D%2C%22b13%22%3A%5Bnull%2C%222048%7C1152%7C24%22%2Cfalse%2Ctrue%5D%7D&APIKey=4_5rnY1vVhTXaiyHmFSwS_Lw&cid=CDO&source=showScreenSet&sdk=js_latest&authMode=cookie&pageURL=https%3A%2F%2Fdictionary.cambridge.org%2F&sdkBuild=15936&format=json",
    "method": "POST"
  });
  console.log(await a.json())
})()