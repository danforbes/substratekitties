import React, { useState, createRef } from 'react';
import { Container, Dimmer, Loader, Grid, Sticky, Message, Tab } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import AccountSelector from './AccountSelector';
import Balances from './Balances';
import BlockNumber from './BlockNumber';
import Events from './Events';
import Interactor from './Interactor';

import Substratekitties from './Substratekitties';
import Metadata from './Metadata';
import NodeInfo from './NodeInfo';

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${err}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  const TabNetwork = () => (
    <Grid stackable columns='equal'>
      <Grid.Row stretched>
        <NodeInfo />
        <Metadata />
        <BlockNumber />
        <BlockNumber finalized />
      </Grid.Row>
      <Grid.Row stretched>
        <Balances />
      </Grid.Row>
      <Grid.Row>
        <Interactor accountPair={accountPair} />
        <Events />
      </Grid.Row>
    </Grid>
  );

  const panes = [
    {
      menuItem: {
        name: 'Kitties',
        key: 'app-kitties'
      },
      render: () =>
        <Tab.Pane key='Kitties'>
          <Substratekitties accountPair={accountPair} />
        </Tab.Pane>
    },
    {
      menuItem: {
        name: 'Network',
        key: 'app-network'
      },
      render: () => <Tab.Pane key='Network'><TabNetwork /></Tab.Pane>
    }
  ];

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <Container>
        <Tab panes={panes} />
      </Container>
      <DeveloperConsole />
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
