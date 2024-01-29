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

Once the daemon is running all the data will be published to `/UPS/{id}/{value}` address.
The `{value}` part is determined by `PUBLISH_VALUES` env variable and has a default value of
`LINEV|LOADPCT|BCHARGE|TIMELEFT|BATTV|TONBATT|NOMINV|NOMBATTV|NOMPOWER`.

Meaning of variables that are returned from UPS daemon:
```
LINEV: Line Voltage
LOADPCT: UPS load [%]
BCHARGE: State of battery charge [%]
TIMELEFT: How long UPS can power stuff from battery [min]
BATTV: Battery voltage [V]
TONBATT: Time spend on battery power [min]
NOMINV: Mains voltage [V]
NOMBATTV: Battery voltage [V]
NOMPOWER: Max power UPS can deliver [W]
```

# Docker

Start your container with this command replacing values to match your system:
```
docker run --name apcups2mqtt -e MQTT_SERVER=192.168.13.37 -e MQTT_USER=user -e MQTT_PASS=password -e SETTINGS=W3siaWQiOjEsICJuYW1lIjoiVVBTMSIsImhvc3QiOiIxMjcuMC4wLjEifV0= -d rmamba/apcups2mqtt
```
