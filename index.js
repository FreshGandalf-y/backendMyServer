const WebSocket = require("ws");
const fs = require("fs");

const { json } = require("stream/consumers");
 
const wss = new WebSocket.Server({ port: 8082});

var lastcommand;
var usrname;

wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("message", function (message) {
       
        try {
            const data = JSON.parse(message);
            
            usrname = data.myusrName;
            lastcommand = data.theLastCommand;
            
            console.log("username: " + usrname)
            console.log("last command: " + lastcommand)
            jsoniseData()
        }catch (error) {
            console.error("mistake by prase:", error)
            ws.send("unregular data-vormat")
        };
    });

    ws.on("close", () => {
        console.log("Client has disconnected")
    })
})

function jsoniseData() {
    const datas = {
        lastCommand: lastcommand,
        usrName: usrname
    };
    fs.writeFile("commands.json", JSON.stringify(datas, null, 4), (err) => {
        if (err) {
            console.error("mistake by save", err)
        } else {
            console.log("file succesfully updated")
        }
    })
};