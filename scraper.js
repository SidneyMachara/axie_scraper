const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;




(async () => {

   /// returns authToken
   const getAuthToken = async (roninAddress) => {
        let url = 'https://axie.zone/profile?ron_addr=0x'+roninAddress;

        try {
            const response = await fetch(url);
            const html = await response.text();

            const dom = new JSDOM(html)
            const doc = dom.window.document;

            const allScriptTags = doc.querySelectorAll("script");

            // extract token
            let splitIntoArray = allScriptTags[allScriptTags.length -1].textContent.split("'");
            splitIntoArray = splitIntoArray[1].split("authtoken=");

            const token = splitIntoArray[1];

            return token;
        } catch (error) {
            console.log(error);
            return "";
        }

   }

   // return HTML
   const fetchPlayerStatsHtml = async (roninAddress,token) => {

        let url = "https://axie.zone/func/profile_content.php?ron_addr=0x"+roninAddress+"&authtoken="+token;
   
        try {
            const response = await  fetch(url, {
                "headers": {
                "accept": "*/*",
                "accept-language": "en-BW,en;q=0.9,es-MX;q=0.8,es-ES;q=0.7,es;q=0.6,ru-RU;q=0.5,ru;q=0.4,en-GB;q=0.3,en-US;q=0.2",
                "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://axie.zone/profile?ron_addr=0x"+roninAddress,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });

            const html = await response.text();

            return html;

        } catch (error) {
          return "";
        }
   }


   /// return stats JSON
   const extractPlayerStats = async (statsHtml) =>{
 
        const dom = new JSDOM(statsHtml)
        const doc = dom.window.document;

        const rank = doc.querySelector("strong").textContent;

        const mmr = doc.querySelector("td:nth-child(2) strong").textContent;

        const matchesString = doc.querySelector("td:nth-child(3) strong").textContent;
        const matches = parseInt(matchesString);

        const rateString = doc.querySelector("td:nth-child(4) strong").textContent.slice(0,2);
        const rate = parseInt(rateString);

        const wins = Math.round(matches * (rate / 100));

        const losses = matches - wins;

        const stats = {
            rank:rank,
            mmr:mmr,
            matches:matches,
            rate:rate,
            wins:wins,
            losses:losses,
        }

        return stats;

   }

   const playerStats = async (roninAddress) => {
       try {
            // 1) get token
            const authtoken = await getAuthToken(roninAddress);

            // 2) get player stats 
            const statsHtml = await fetchPlayerStatsHtml(roninAddress,authtoken);

            // 3) extract stats
            const statsJosn = await extractPlayerStats(statsHtml);

            return statsJson;
       } catch (error) {
           return {};
       }
        
   }



//    let ron_addr = '8bcde990ad56d7a26fd6199821ad9e9ebb47e86f';
   let ron_addr = 'a58e9f887d3c914885eedbb12e332da4f2ea76fd';
   const statsJson = await playerStats(ron_addr);
   console.log(statsJson);

})();








