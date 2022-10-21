const WebSocket = require('ws');


const createEchoServer = server => {
    const wsServer = new WebSocket.Server({ server });

    const map = new Map();
    wsServer.on('connection', (ws, req) => {
        // console.log('連線數:', wsServer.clients.size);
        map.set(ws, { name: '' });
        ws.on('message', message => {
            let sendMsg = ''; //廣播內容
            const obj = map.get(ws);
            if (!obj.name) {
                obj.name = message.toString(); //第一次的訊息設為名稱
                sendMsg = obj.name + '進來了; 目前人數:' + wsServer.clients.size;
            } else {
                sendMsg = `${obj.name}:${message.toString()}`;
            }
            wsServer.clients.forEach(c => {
                if (c.readyState === 1) {  //
                    c.send(sendMsg);
                };
            });
        });

        ws.on('close', () => {
            const obj = map.get(ws);
            wsServer.clients.forEach(c => {
                if (c.readyState === WebSocket.OPEN) {
                    c.send(`${obj.name}離開了; 目前人數: ${wsServer.clients.size}`)
                }
            })
        })




    })
}


module.exports = createEchoServer;