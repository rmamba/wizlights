import React from 'react';
import { Box } from '@mui/material';

/**
 * General Button Component.
 * @param props - Property collection.
 */
const WizLightScene = (props: IWizLightSceneProps) => {
    return (
        <Box
            id={`wizSideButton-${props.idx}`}
            style={{
                display: 'inline-block',
                margin: '2px',
                padding: '0px',
                minWidth: 'unset',
                zIndex: 11,
                width: 'fit-content',
            }}
        >
            {props.children}
        </Box>
    );
};

export interface IWizLightSceneProps {
    children: React.ReactNode;
    idx: number;
}

export default WizLightScene;
