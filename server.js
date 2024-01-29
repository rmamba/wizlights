const express = require('express');
const cors = require('cors');
const dgram = require('dgram');
const mqtt = require('mqtt');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const subscribeToAddress = (process.env.PUBLISH_VALUES || 'dimming|temp|state|sceneId').split('|');

const DEBUG = (process.env.DEBUG || 'false') === 'true';
const MQTT_CLIENT_ID = process.env.MQTT_CLIENT_ID || 'wizLights';
const MQTT_PREFIX = process.env.MQTT_PREFIX || 'wiz';
const MQTT_SERVER = process.env.MQTT_SERVER || '127.0.0.1';
const MQTT_PORT = process.env.MQTT_PORT || '1883';

let UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || '1000');
if (UPDATE_INTERVAL < 250) {
    UPDATE_INTERVAL = 250;
}

let mqttClient;
let broadcastClient;
const cache = {};

const ProcessData = (ip, buffer) => {
    const data = JSON.parse(buffer.toString());
    if (!data.result?.mac) {
      return;
    }

    const mac = data.result.mac;
    const mqttPathPrefix = `/${MQTT_PREFIX}/${mac}`;
    if (!cache[mac]) {
        cache[mac] = {}
    }
    data.result.ip = ip;
    delete data.result.mac;

    Object.keys(data.result).forEach(key => {
        const path = `${mqttPathPrefix}/${key}`;
        if (cache[mac][key] !== data.result[key]) {
            if (subscribeToAddress.indexOf(key) !== -1) {
                mqttClient.publishAsync(path, data.result[key].toString());
            }
            cache[mac][key] = data.result[key];
        }
    });

    if (DEBUG) {
        console.log(cache[mac]);
    }
};

const run = async () => {
    const mqttConfig = {
        clientId: MQTT_CLIENT_ID,
        rejectUnauthorized: false,
        keepalive: 15,
        connectTimeout: 1000,
        reconnectPeriod: 500,
    };

    if (process.env.MQTT_USER) {
        mqttConfig.username = process.env.MQTT_USER;
    }
    if (process.env.MQTT_PASS) {
        mqttConfig.password = process.env.MQTT_PASS;
    }

    console.log(`Connecting to MQTT server ${MQTT_SERVER}:${MQTT_PORT}`);
    mqttClient = mqtt.connect(`mqtt://${MQTT_SERVER}:${MQTT_PORT}`, mqttConfig);

    mqttClient.on('connect', () => {
        console.log('MQTT server connected...');
    });
    
    mqttClient.on('error', (err) => {
        console.log(err);
        process.exit(1);
    });
    
    while (!mqttClient.connected) {
        await sleep(1000);
    }

    console.log('Setting UDP discovery...');
    broadcastClient = dgram.createSocket('udp4');
    broadcastClient.on('listening', () => {
      console.log('now listening...')
      broadcastClient.setBroadcast(true)

      const msg = Buffer.from('{"method":"getPilot","params":{}}')
      setInterval(() => {
        if (DEBUG) {
            console.log('send message');
        }
        broadcastClient.send(msg, 38899, '255.255.255.255', (err, bytes) => {
          if (err) {
            console.error('broadcast error', err);
          }
        });
      }, UPDATE_INTERVAL)
    });
    broadcastClient.on('message', (buffer, info) => {
        if (DEBUG) {
            console.log(info);
        }
        ProcessData(info.address, buffer);
    });
    broadcastClient.bind(38899);

    console.log('Setting up express server on port 3000...');
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get('/', function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(cache);
    });

    app.get('/:mac', function (req, res) {
        if (!cache[req.params.mac]) {
            res.status(404);
            res.json({
                message: 'not found'
            });
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(cache[req.params.mac]);
    });

    app.post('/:mac/status/:val', function (req, res) {
        if (!cache[req.params.mac]) {
            res.status(404);
            res.json({
                message: 'not found'
            });
            return;
        }
        const msg = `{"id":1,"method":"setState","params":{"state":${req.params.val === '1' ? 'true' : 'false'}}}`;
        broadcastClient.send(msg, 38899, cache[req.params.mac].ip, (err, bytes) => {
            if (err) {
                console.error('broadcast error', err);
                res.status(400);
                // res
            } else {
                res.setHeader("Content-Type", "application/json");
                res.status(200);
                res.json({ message: 'ok' });
            }
        });
    });

    app.post('/:mac/status/:status/dim/:dim', function (req, res) {
        if (!cache[req.params.mac]) {
            res.status(404);
            res.json({
                message: 'not found'
            });
            return;
        }
        const msg = `{"id":1,"method":"setState","params":{"state":${req.params.status === '1' ? 'true' : 'false'},"dimming":${parseInt(req.params.dim)}}}`;
        broadcastClient.send(msg, 38899, cache[req.params.mac].ip, (err, bytes) => {
            if (err) {
                console.error('broadcast error', err);
                res.status(400);
                // res
            } else {
                res.setHeader("Content-Type", "application/json");
                res.status(200);
                res.json({ message: 'ok' });
            }
        });
    });

    // app.post('/:mac/scene/:val', function (req, res) {
    //     if (!cache[req.params.mac]) {
    //         res.status(404);
    //         res.json({
    //             message: 'not found'
    //         });
    //         return;
    //     }
    //     const msg = `{"id":1,"method":"setState","params":{"state":${req.params.val === '1' ? 'true' : 'false'}}}`;
    //     broadcastClient.send(msg, 38899, cache[req.params.mac].ip, (err, bytes) => {
    //         if (err) {
    //             console.error('broadcast error', err);
    //             res.status(400);
    //             // res
    //         } else {
    //             res.setHeader("Content-Type", "application/json");
    //             res.status(200);
    //             res.json({ message: 'ok' });
    //         }
    //     });
    // });

    app.post('/:mac/dim/:val', function (req, res) {
        if (!cache[req.params.mac]) {
            res.status(404);
            res.json({
                message: 'not found'
            });
            return;
        }
        const msg = `{"id":1,"method":"setState","params":{"dimming":${parseInt(req.params.val)}}}`;
        broadcastClient.send(msg, 38899, cache[req.params.mac].ip, (err, bytes) => {
            if (err) {
                console.error('broadcast error', err);
                res.status(400);
                res.end();
            } else {
                res.setHeader("Content-Type", "application/json");
                res.status(200);
                res.json({ message: 'ok' });
            }
        });
    });

    app.post('/:mac/scene/:sceneId', function (req, res) {
        if (!cache[req.params.mac]) {
            res.status(404);
            res.json({
                message: 'not found'
            });
            return;
        }
        const msg = `{"id":1,"method":"setState","params":{"sceneId":${parseInt(req.params.sceneId)}}}`;
        broadcastClient.send(msg, 38899, cache[req.params.mac].ip, (err, bytes) => {
            if (err) {
                console.error('broadcast error', err);
                res.status(400);
                res.end();
            } else {
                res.setHeader("Content-Type", "application/json");
                res.status(200);
                res.json({ message: 'ok' });
            }
        });
    });

    app.listen(3000)

    console.log('Done...');
}

run();
