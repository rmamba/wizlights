import React from 'react';

import { ReactComponent as IconLightsOn } from '../assets/solid-lightbulb.svg';
import { ReactComponent as IconLightsOff } from '../assets/regular-lightbulb.svg';
import { ReactComponent as IconCoolWhiteLight } from '../assets/solid-snowflake.svg';
import { ReactComponent as IconDayLight } from '../assets/solid-sun.svg';
import { ReactComponent as IconFocusLight } from '../assets/solid-book-open-reader.svg';
import { ReactComponent as IconNightLight } from '../assets/solid-moon.svg';
import { ReactComponent as IconRelaxLight } from '../assets/solid-couch.svg';
import { ReactComponent as IconTvLight } from '../assets/solid-tv.svg';
import { Box, Button } from '@mui/material';
import { IWizLightConfig, WizSceneENUM } from '../App';
import WizLightScene from './WizLightScene';

const btnStyle = {
    padding: '5px',
    height: '48px',
    width: '48px',
};

/**
 * General Button Component.
 * @param props - Property collection.
 */
const WizLightGroup = (props: IWizLightSwitchProps) => {
    return (
        <Box sx={{
            border: '2px solid gray',
            display: 'inline-flex',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            margin: '5px 10px',
            width: '425px',
            height: '185px',
            overflow: 'hidden',
            flexDirection: 'column-reverse',
            flexWrap: 'wrap',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            verticalAlign: 'middle'
        }}>
            <Box sx={{
                display: 'grid',
                width: '100%',
            }}>
                <Box sx={{
                    alignItems: 'center',
                    display: 'flex',
                    overflow: 'hidden',
                    height: '150px',
                }}>
                    <Button
                        variant="text"
                        style={{
                            display: 'inline-block',
                            margin: '10px auto',
                            height: 'fit-content',
                            width: 'fit-content',
                        }}
                    >
                    {
                        props.config.onState
                        ? <IconLightsOn className={'iconSelected'} width={96} height={96} style={{display: 'inline-block', margin: 'auto'}}/>
                        : <IconLightsOff className={'iconDeselected'} width={96} height={96} style={{display: 'inline-block', margin: 'auto'}}/>
                    }
                    </Button>
                    <Box
                        sx={{
                            display: 'inline-block',
                            margin: '5px',
                            width: '200px',
                        }}
                    >
                        <WizLightScene idx={0}><IconDayLight className={props.config.sceneId === WizSceneENUM.Daylight ? 'iconSelected' : 'iconDeselected'} style={btnStyle} /></WizLightScene>
                        <WizLightScene idx={1}><IconFocusLight className={props.config.sceneId === WizSceneENUM.Focus ? 'iconSelected' : 'iconDeselected'} style={btnStyle} /></WizLightScene>
                        <WizLightScene idx={2}><IconNightLight className={props.config.sceneId === WizSceneENUM.NightLight ? 'iconSelected' : 'iconDeselected'} style={btnStyle} /></WizLightScene>
                        <WizLightScene idx={3}><IconRelaxLight className={props.config.sceneId === WizSceneENUM.Relax ? 'iconSelected' : 'iconDeselected'} style={btnStyle} /></WizLightScene>
                        <WizLightScene idx={4}><IconTvLight className={props.config.sceneId === WizSceneENUM.TVTime ? 'iconSelected' : 'iconDeselected'} style={btnStyle} /></WizLightScene>
                        <WizLightScene idx={5}><IconCoolWhiteLight className={props.config.sceneId === WizSceneENUM.CoolWhite ? 'iconSelected' : 'iconDeselected'} style={btnStyle} /></WizLightScene>
                    </Box>
                </Box>
                <Box sx={{
                    alignItems: 'flex-end',
                    display: 'grid',
                    height: '35px',
                    width: '100%',
                }}>
                    <p style={{color: 'whitesmoke', display: 'inline-block', fontSize: '20px', fontWeight: 'inherit', margin: '0px', lineHeight: '1.75'}}>{props.config.name}</p>
                </Box>
            </Box>
        </Box>
    );
};

export interface IWizLightSwitchProps {
    className?: string;
    config: IWizLightConfig;
}

export default WizLightGroup;
