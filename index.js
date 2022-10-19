const { Client, LocalAuth  } = require('whatsapp-web.js');
const axios = require("axios");


const client = new Client({
    authStrategy: new LocalAuth(),
});
const qrcode = require('qrcode-terminal');

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('logged in');
});

const getTicketInformation = async () => {
    const url = "https://ventas.autoentrada.com/events/search.json?q=Talleres&searching=true";
    const headers = {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        Referer: "https://ventas.autoentrada.com/t/deporte",
        "Referrer-Policy": "strict-origin-when-cross-origin",
    };

    const data =  await axios.get(url,{ headers });
    return data.data;

};


client.on('ready',async () => {
    const sendMessage = async () => {
        const chatId = "543516745259@c.us"
        const info = await getTicketInformation();
        const content = info.results && info.results.length > 0 ? "Hay entradas disponibles" : "No hay entradas todavía"
        await client.sendMessage(chatId, content);
        console.log('Information sent');
    }

    setInterval(sendMessage, 150000);

});
