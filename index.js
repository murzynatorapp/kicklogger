console.log("Launching KickBotLogger");

import { error } from "console";
import ws from "ws";
import fs from "fs";
import express from "express";
import path from "path";
import { json } from "stream/consumers";

const chat = new ws(
  "wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false"
);

chat.on("open", function open() {
    chat.send(
      JSON.stringify({
        event: "pusher:subscribe",
        data: { auth: "", channel: `channel.4137340` },
      }),
    chat.send(
      JSON.stringify({
        event: "pusher:subscribe",
        data: { auth: "", channel: `chatrooms.4125683.v2` },
      })
    ));
  });

chat.on("message", function message(data) {
  let dataString = data.toString();
  let jsonData = JSON.parse(dataString);
  let jsonDataSub = JSON.parse(jsonData.data);
  let jsonSender = jsonDataSub.sender;
  
  let message = jsonDataSub.created_at + 
  " "  +  
  jsonSender?.username + 
  ": " + jsonDataSub.content
  fs.appendFile('adamcy-log.txt', message + '\r\n', function (err) {
    if (err) return console.log(err);
    console.log('successfully appended "' + message + '"');
    });
});

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('web/index.html'));
});

app.get('/search', (req, res) => {
  const searchWord = req.query.word.toLowerCase();
  const filePath = 'adamcy-log.txt'; // Ścieżka do pliku tekstowego

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Błąd serwera');
      return;
    }

    const lines = data.split('\n');
    const matchingLines = lines.filter(line => {
        const words = line.toLowerCase().split(' ');
        return words.includes(searchWord);
    });
    const html = matchingLines.map(line => `<div style="color:#ffcc00;">${line}</div>`).reverse().join('');
    res.send(html);
  });
});

app.listen(process.env.PORT || 80, '0.0.0.0', () => {
  console.log('Serwer działa na porcie 3000');
});
