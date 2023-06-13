console.log("Launching KickBotLogger");

import { error } from "console";
import ws from "ws";
import fs from "fs";
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

  let message = new Date().toLocaleDateString() + 
  " "  + 
  new Date().toLocaleTimeString() + 
  " " + 
  jsonSender?.username + 
  ": " + jsonDataSub.content
  fs.appendFile('adamcy-log.txt', message + '\r\n', function (err) {
    if (err) return console.log(err);
    console.log('successfully appended "' + message + '"');
    });
});
