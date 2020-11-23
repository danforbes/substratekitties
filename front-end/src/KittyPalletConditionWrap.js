import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';

import usePalletTab from './KittyHooks';
import styled from 'styled-components';

const CallPalletButton = styled(Button)`
  &&& {
    background: transparent;
    padding: 0;
  }
`;

function Main ({
  children,
  pallet = null,
  call = true
}) {
  const { api } = useSubstrate();
  const { settings, setKittyTab } = usePalletTab();

  if (!api.tx.substratekitties[pallet]) return <></>;

  return (
    <>
      {
        !call
          ? children
          : <CallPalletButton
            className='callPallet'
            onClick={() => setKittyTab(pallet)}
          >
            { children }
          </CallPalletButton>
      }
    </>
  );
}

export default Main;
