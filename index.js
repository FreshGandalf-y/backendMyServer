const WebSocket = require("ws");
const fs = require("fs");
const axios = require('axios');


const { json } = require("stream/consumers");
 
const wss = new WebSocket.Server({ port: 8082});

var lastcommand;
var usrname;

wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("message", async function (message) {
        try {
            const data = JSON.parse(message);
            console.log("Daten schon ge-parse", data)
            await axios.post('http://localhost:5002/save', data);
            ws.send("data saved in python-backend")

        } catch (error) {
            console.error("mistake:", error);
        }
        
        /*try {
            const data = JSON.parse(message);
            
            usrname = data.myusrName;
            lastcommand = data.theLastCommand;

            console.log("username: " + usrname)
            console.log("last command: " + lastcommand)
            //jsoniseData()
        }catch (error) {
            console.error("mistake by prase:", error)
            ws.send("unregular data-format")
        };*/
    });

    ws.on("close", () => {
        console.log("Client has disconnected")
    })
})

function jsoniseData(arg) {
    const datas = {};

    if (!err && data) {
        datas = JSON.parse(data);
    };

    datas.newVar = {
        lastCommand: lastcommand,
        usrName: usrname
    };
    fs.readFile('commands.json', 'utf8', (err, data) => {
        fs.writeFile("commands.json", JSON.stringify(datas, null, 4), (err) => {
            if (err) {
                console.error("mistake by save", err)
            } else {
                console.log("file succesfully updated")
            };
        });
    });
    
};