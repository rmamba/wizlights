# WHAT is wizlights?

This container will read data from wiz lights found on local network and publish it to MQTT server.
It will also expose REST server to read and control lights via POST requests.

# MQTT Configuration

You can define MQTT server via env variables like so:
```
MQTT_SERVER=127.0.0.1
MQTT_PORT=1883
MQTT_USER=
MQTT_PASS=
```
The values listed are default so you can only use the env variable if you want to change it.

# MQTT

Once the daemon is running all the data will be published to `/wiz/{macaddress}/{value}` address.
The `{value}` part is determined by `PUBLISH_VALUES` env variable and has a default value of
`dimming|temp|state|sceneId`.

Meaning of variables that are returned from UPS daemon:
```
dimming: Dim light from 0 to 100
temp: light temperature ? to ?
state: boolean state for ON/OFF
sceneId: predefined scene from 0 to 103
```

Scenes from [wiz-local-control](https://gitlab.com/wizlighting/wiz-local-control/-/blob/master/src/classes/types.ts?ref_type=heads) project:
```
export const staticScenes: Array<LightMode> = [
  {
    type: "scene",
    sceneId: 1,
    name: "Ocean",
  },
  {
    type: "scene",
    sceneId: 2,
    name: "Romance",
  },
  {
    type: "scene",
    sceneId: 3,
    name: "Sunset",
  },
  {
    type: "scene",
    sceneId: 4,
    name: "Party",
  },
  {
    type: "scene",
    sceneId: 5,
    name: "Fireplace",
  },
  {
    type: "scene",
    sceneId: 6,
    name: "Cozy",
  },
  {
    type: "scene",
    sceneId: 7,
    name: "Forest",
  },
  {
    type: "scene",
    sceneId: 8,
    name: "Pastel colors",
  },
  {
    type: "scene",
    sceneId: 9,
    name: "Wake up",
  },
  {
    type: "scene",
    sceneId: 10,
    name: "Bedtime",
  },
  {
    type: "scene",
    sceneId: 11,
    name: "Warm white",
  },
  {
    type: "scene",
    sceneId: 12,
    name: "Daylight",
  },
  {
    type: "scene",
    sceneId: 13,
    name: "Cool white",
  },
  {
    type: "scene",
    sceneId: 14,
    name: "Night Light",
  },
  {
    type: "scene",
    sceneId: 15,
    name: "Focus",
  },
  {
    type: "scene",
    sceneId: 16,
    name: "Relax",
  },
  {
    type: "scene",
    sceneId: 17,
    name: "True colors",
  },
  {
    type: "scene",
    sceneId: 18,
    name: "TV Time",
  },
  {
    type: "scene",
    sceneId: 19,
    name: "Plant growth",
  },
  {
    type: "scene",
    sceneId: 20,
    name: "Spring",
  },
  {
    type: "scene",
    sceneId: 21,
    name: "Summer",
  },
  {
    type: "scene",
    sceneId: 22,
    name: "Fall",
  },
  {
    type: "scene",
    sceneId: 23,
    name: "Deep dive",
  },
  {
    type: "scene",
    sceneId: 24,
    name: "Jungle",
  },
  {
    type: "scene",
    sceneId: 25,
    name: "Mojito",
  },
  {
    type: "scene",
    sceneId: 26,
    name: "Club",
  },
  {
    type: "scene",
    sceneId: 27,
    name: "Christmas",
  },
  {
    type: "scene",
    sceneId: 28,
    name: "Halloween",
  },
  {
    type: "scene",
    sceneId: 29,
    name: "Candlelight",
  },
  {
    type: "scene",
    sceneId: 30,
    name: "Golden White",
  },
  {
    type: "scene",
    sceneId: 31,
    name: "Pulse",
  },
  {
    type: "scene",
    sceneId: 32,
    name: "Steampunk",
  },
  {
    type: "scene",
    sceneId: 33,
    name: "Diwali",
  },
  {
    type: "scene",
    sceneId: 34,
    name: "White",
  },
  {
    type: "scene",
    sceneId: 35,
    name: "Alarm",
  },
  {
    type: "scene",
    sceneId: 36,
    name: "Snowy Sky",
  },
  {
    type: "scene",
    sceneId: 100,
    name: "EyeCare Study",
  },
  {
    type: "scene",
    sceneId: 101,
    name: "EyeCare Screen",
  },
  {
    type: "scene",
    sceneId: 102,
    name: "EyeCare Activity",
  },
  {
    type: "scene",
    sceneId: 103,
    name: "EyeCare 202020",
  },
];
```

# Docker

Start your container with this command replacing values to match your system:
```
docker run --name wizlights -e MQTT_SERVER=192.168.13.37 -e MQTT_USER=user -e MQTT_PASS=password -d rmamba/wizlights
```
