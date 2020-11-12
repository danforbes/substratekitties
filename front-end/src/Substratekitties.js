import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from './theme';
import { Button, Card, Grid, Header, Icon } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

import { KittyAvatar } from './kitty-avatar';
import { KittyPower } from './KittyPower';

function hexToString (hex) {
  hex = hex.substr(2);

  let string = '';
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return string;
}

function calculatePower (hex) {
  hex = hex.substr(2);
  return parseInt(hex[parseInt(hex[hex.length - 1], 16)], 16);
}

const KittyButtonsWrap = styled(Button.Group)`
  &&& {
    width: 100%;
    border: none;
    justify-content: space-between;
    margin-top: -2rem;
    
    .ui.button {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      max-width: 18%;
      padding: 0.5rem !important;
      background-color: ${theme.colors.app.highlight};
      border: 1px solid ${theme.colors.app.border};
      border-radius: 0.5rem;
      margin-top: 3rem;

      &.central {
        margin-top: 0;
        z-index: 0;
      }
      &.forKittiesConsole {
        color: ${theme.colors.console.border} !important;
        border-color: ${theme.colors.console.border};
        &:hover {
          background-color: ${theme.colors.console.bg};
        }
      }
      &.animated .visible.content {
        margin: 0;
      }

      b {
        margin-top: 0.5rem;
      }
      .icon {
        margin: 0;
      }
      small {
        display: block;
        word-break: break-all;
        font-size: 7px;
        line-height: 1.2em;
      }
    }
  }
`;

function Main (props) {
  const { api } = useSubstrate();
  const [kittyCommodities, setKittyCommodities] = useState([]);
  const [kitties, setKitties] = useState([]);
  useEffect(() => {
    let unsubscribe;
    api.query.kittiesCommodities.commoditiesForAccount(props.accountPair.address, (userKitties) => {
      setKittyCommodities(userKitties || []);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, [api.query.kittiesCommodities, props.accountPair.address]);

  useEffect(() => {
    const kitties = [];
    const kittyIds = kittyCommodities.map((kitty) => kitty.CommodityId);
    let unsubscribe;
    api.query.substratekitties.metadataForKitty.multi(kittyIds, (allMetadata) => {
      allMetadata.forEach((metadata, ndx) => {
        const dna = kittyCommodities[ndx].CommodityInfo.dna.toHex();
        kitties.push({
          id: kittyCommodities[ndx].CommodityId.toHex(),
          dna: dna,
          dob: new Date(kittyCommodities[ndx].CommodityInfo.dob.toNumber()),
          name: hexToString(`${metadata.name}`),
          power: calculatePower(`${dna}`)
        });
      });

      setKitties(kitties);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => unsubscribe && unsubscribe();
  }, [kittyCommodities, api.query.substratekitties.metadataForKitty]);

  return (
    <Grid.Column>
      <Card.Group itemsPerRow={3}>
        {kitties.map((kitty) => {
          return <Card key={kitty.id} raised>
            <Card.Content>

              <Grid padded={false}>
                <Grid.Column width={10}>
                  <Header as='h3' floated='left'>
                    {kitty.name}
                  </Header>
                </Grid.Column>
                <Grid.Column width={6} textAlign='right'>
                  <Icon link name='eraser'/>
                  <Icon link name='heart'/>
                  <Icon link name='shopping basket'/>
                </Grid.Column>
              </Grid>

            </Card.Content>
            <Card.Content>

              <KittyAvatar dna={kitty.dna} />
              <KittyButtonsWrap compact size='tiny'>
                <Button animated='fade'>
                  <Button.Content visible>
                    <small>{kitty.id}</small>
                  </Button.Content>
                  <Button.Content hidden>
                    <Icon name='copy'/>
                  </Button.Content>
                  <b>ID</b>
                </Button>
                <Button animated='fade'>
                  <Button.Content visible>
                    <small>{props.accountPair.address}</small>
                  </Button.Content>
                  <Button.Content hidden>
                    <Icon name='copy'/>
                  </Button.Content>
                  <b>owner</b>
                </Button>
                <Button className='central'>
                  <KittyPower power={kitty.power} />
                  <b>Power</b>
                </Button>
                <Button className='forKittiesConsole'>
                  <small/>
                  <Icon name='heart' size='large'/>
                  <b>Flirt</b>
                </Button>
                <Button className='forKittiesConsole'>
                  <small/>
                  <Icon name='shopping basket' size='large'/>
                  <b>Buy</b>
                </Button>
              </KittyButtonsWrap>

            </Card.Content>
          </Card>;
        })}
      </Card.Group>
    </Grid.Column>
  );
}

export default function Substratekitties (props) {
  const { api } = useSubstrate();
  return api.query.kittiesCommodities &&
         api.query.substratekitties.metadataForKitty &&
         props.accountPair
    ? <Main {...props} />
    : null;
}
