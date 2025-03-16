const WebSocket = require("ws");
const fs = require("fs");
const axios = require('axios');
const os = require("os");


const { json } = require("stream/consumers");
const { cpus } = require("os");
const { error } = require("console");
 
const wss = new WebSocket.Server({port: 8082});

var lastcommand;
var usrname;
var isCpuDataSet = false;

wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("message", async function (message) {
        
        try {
            const data = JSON.parse(message);
            console.log('recived message', data);

            if (data.type === 'desktopsContant') {
                
                fs.readFile('contantDesktop.json', 'utf-8', (err, fileData) => {
                    if (err) {
                        console.error('mistake', err);
                        ws.send(JSON.stringify({type: 'error', message: 'mistake by loading File'}));
                    } else {
                        ws.send(JSON.stringify({type: 'desk-topsContant', html: fileData}));
                        console.log("send desktop-pictures")
                    }
                })
            } else if (data.type === 'getContentDashbord') {
                const isAutorized = true;

                if (isAutorized) {
                    fs.readFile('dashbordFrontend.html', 'utf8', (err, fileData) => {
                        if (err) {
                            console.error('Fehler beim Laden der Datei:', err);
                            ws.send({ type: 'error', message: 'mistake by loading File'});
                        } else {
                            ws.send(JSON.stringify({type: 'contant', html: fileData}));
                            console.log("Dashbord send")
                            
                        }
                    })
                } else {
                    ws.send(JSON.stringify({type: 'error', message: 'no permittion'}))
                } 

            } else if (data.type === 'chatmessage') {
                try {
                    
                    console.log("data parsed", data)
                    //await axios.post('http://localhost:5002/save', data);
                    ws.send(JSON.stringify({type: 'chatResponse', data}))
    
                } catch (error) {
                    console.error("mistake:", error);
                }
            } else if (data.type === "CpuUsage") {
                console.log("will send")
                const cpus = {
                    cpu1: 1,
                    cpu2: 1,
                    cpu3: 1,
                    cpu4: 1
                }

                function getCpuUsage() {
                    const cpus = os.cpus();
                    let totalIdle = 0, totalTick = 0;
                    cpus.forEach(cpu => {
                        for (let type in cpu.times) {
                            totalTick += cpu.times[type];
                        }
                        totalIdle += cpu.times.idle;
                    });
                    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
                }
                    const start = getCpuUsage();
                    function hhh() {
                    setTimeout(() => {
                        const end = getCpuUsage();
                        const idleDiff = end.idle - start.idle;
                        const totalDiff = end.total - start.total;
                        const usage = 100 - (100 * idleDiff / totalDiff);
                        const ent = console.log(`CPU Usage: ${usage.toFixed(2)}%`);
                        
                    }, 1000);
                    isCpuDataSet = true;
                    
                }
                function setCpus(arg) {
                    if (isCpuDataSet == true) {
                        console.log("jj")
                        cpus.cpu1 = arg;
                        cpus.cpu2 = arg;
                        cpus.cpu3 = arg;
                        cpus.cpu4 = arg;
                        ws.send(JSON.stringify({type: "CpuUsage", cpus}))
                    }
                }
                
                
            }


        } catch (error) {
            console.error('mistake', error)
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