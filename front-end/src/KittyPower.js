import React from 'react';
import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { useSubstrate } from './substrate-lib';
import theme from './theme';

const KittyPowerWrap = styled.div`
  display: flex;
  align-items: center;

  .segment {
    margin: 0;
  }
`;
const KittyPowerBars = styled.div`
  position: absolute;
  left: 1rem;
  display: flex;
  width: calc(100% - 2rem);
  height: 0.5rem;

  div {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    background: ${theme.colors.console.highlight};

    &.boost {
      background: ${theme.colors.brand.bg};  
    }  
  }
`;

function KittyPower ({
  power = 1,
  boost = 0 // placeholder for boosted part of power
}) {
  const { api } = useSubstrate();

  return (
    <KittyPowerWrap>
      <KittyPowerBars>
        <div />
        { api.tx.substratekitties.boost && <div className='boost' /> }
      </KittyPowerBars>
      <Segment compact>
        {power}
      </Segment>
    </KittyPowerWrap>
  );
}

export { KittyPower };
