import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import './App.css';
import WizLightGroup from './components/WizLightGroup';

export interface IMqttAddress {
  state: string;
  relay: string;
}

export interface IWizAddress {
  api: string;
  mqtt: string;
  mac: Array<string>;
}

export enum WizCommandENUM {
  Off,
  On,
}

export enum WizSceneENUM {
  None,
  Ocean,
  Romance,
  Sunset,
  Party,
  Fireplace,
  Cozy,
  Forest,
  PastelColors,
  WakeUp,
  Bedtime,
  WarmWhite,
  Daylight,
  CoolWhite,
  NightLight,
  Focus,
  Relax,
  TrueColors,
  TVTime,
  Plantgrowth,
  Spring,
  Summer,
  Fall,
  Deepdive,
  Jungle,
  Mojito,
  Club,
  Christmas,
  Halloween,
  Candlelight,
  GoldenWhite,
  Pulse,
  Steampunk,
}

export interface IWizLightConfig {
  macid: string;
  name: string;
  onState: boolean;
  sceneId: number;
  temp: number;
}

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsMessage, setWsMessage] = useState<any | null>(null);
  const [switches, setSwitches] = useState<Array<IWizLightConfig>>([]);

  useEffect(() => {
    const webSocket = new WebSocket(`${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.location.host}/ws`);
    setWs(webSocket);
  }, []);

  useEffect(() => {
    if (!ws) {
      return;
    }

    ws.onerror = (ev: Event) => {
      console.log(ev)
    };

    ws.onmessage = (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      setWsMessage(data);
    };
  }, [ws]);

  useEffect(() => {
    if (!wsMessage) {
      return;
    }
    setSwitches(Object.keys(wsMessage).map(k => {
      return {
        name: wsMessage[k]['alias'] ?? k,
        macid: k,
        onState: wsMessage[k]['state'],
        sceneId: wsMessage[k]['sceneId'],
        temp: wsMessage[k]['temp'],
      } as IWizLightConfig;
    }));
  }, [wsMessage]);

  return (
    <Grid container spacing={0}>
      <Grid item style={{
        fontSize: '23px',
        fontWeight: 'inherit',
        margin: 'auto',
        height: '30px',
      }}>
        {new Date().toLocaleString("sl-SI", {
          day: 'numeric',
          month:'numeric',
          year:'numeric',
          hour: '2-digit',
          minute:'2-digit',
        })}
      </Grid>
      <Grid item style={{
        margin: 'auto',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {switches.map(conf => <WizLightGroup key={conf.macid} config={conf} />)}
      </Grid>
    </Grid>
  );
} 

export default App;
