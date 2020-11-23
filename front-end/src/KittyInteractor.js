import React, { useEffect, useState } from 'react';
import { Container, Grid, Input, Label, Tab } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxGroupButton } from './substrate-lib/components';

import KittyInteractorStyleWrap from './KittyInteractorStyleWrap';
import useKittyTab from './KittyHooks';

const argIsOptional = (arg) =>
  arg.type.toString().startsWith('Option<');

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;
  const [status, setStatus] = useState(null);

  const interxType = 'EXTRINSIC';
  const [callables, setCallables] = useState([]);
  const x = Object.keys(api.tx.substratekitties).sort();

  const updateCallables = () => {
    if (!api) { return; }
    const callables = Object.keys(api.tx.substratekitties).sort()
      .map(c => ({ key: c, value: c, text: c }));
    setCallables(callables);
  };

  const { kittyTab, setKittyTab } = useKittyTab();

  const initFormState = {
    palletRpc: 'substratekitties',
    callable: kittyTab,
    inputParams: []
  };

  const [formState, setFormState] = useState(initFormState);
  const { palletRpc, callable, inputParams } = formState;

  const initparamFields = (kittyTab) => {
    let paramFields = [];
    if (!api || !api.tx.substratekitties[kittyTab]) return;
    const metaArgs = api.tx.substratekitties[kittyTab].meta.args;

    if (metaArgs && metaArgs.length > 0) {
      paramFields = metaArgs.map(arg => ({
        name: arg.name.toString(),
        type: arg.type.toString(),
        optional: argIsOptional(arg)
      }));
    }
    return paramFields;
  };

  const [paramFields, setParamFields] = useState(initparamFields);

  const updateParamFields = () => {
    if (!api || callable === '' || !api.tx.substratekitties[callable]) {
      setParamFields([]);
      return;
    }

    let paramFields = [];
    const metaArgs = api.tx.substratekitties[callable].meta.args;

    if (metaArgs && metaArgs.length > 0) {
      paramFields = metaArgs.map(arg => ({
        name: arg.name.toString(),
        type: arg.type.toString(),
        optional: argIsOptional(arg)
      }));
    }

    setParamFields(paramFields);
  };

  useEffect(updateCallables, [api, interxType]);
  useEffect(updateParamFields, [api, interxType, palletRpc, callable]);

  const onPalletCallableParamChange = (_, data) => {
    if (data.state === 'callable') setKittyTab(x[data.activeIndex - staticPanes.length]);

    // static panes do not correspond to callables and come first
    if (data.activeIndex < staticPanes.length) {
      return false;
    }

    setFormState(formState => {
      let res;
      const { state, value } = data;

      if (typeof state === 'object') {
        // Input parameter updated
        const { ind, paramField: { type } } = state;
        const inputParams = [...formState.inputParams];
        inputParams[ind] = { type, value };
        res = { ...formState, inputParams };
      } else if (state === 'callable') {
        res = { ...formState, [state]: callables[data.activeIndex - staticPanes.length].value, inputParams: [] };
      }
      return res;
    });
  };

  const getOptionalMsg = (interxType) =>
    interxType === 'RPC'
      ? 'Optional Parameter'
      : 'Leaving this field as blank will submit a NONE value';

  const staticPanes = [
    {
      menuItem: {
        icon: 'close',
        className: 'close',
        key: 'close'
      }
    }
  ];

  return (
    <KittyInteractorStyleWrap>
      <Container>
        <Tab
          activeIndex={
            x.indexOf(kittyTab) !== -1
              ? x.indexOf(kittyTab) + staticPanes.length
              : 0
          }
          state='callable'
          onTabChange={onPalletCallableParamChange}
          panes={[
            ...staticPanes,
            ...callables.map(c => {
              return {
                menuItem: {
                  name: c.text,
                  key: c.text
                },
                value: c.text,
                render: () =>
                  <Grid>
                    <code>
                      api.tx.substratekitties.{c.text}('

                      {initparamFields(kittyTab).map((paramField, ind) =>
                        <span key={ind}>

                          <label>{paramField.name}</label>
                          <Input
                            placeholder={paramField.type}
                            type='text'
                            state={{ ind, paramField }}
                            value={ inputParams[ind] ? inputParams[ind].value : '' }
                            onChange={onPalletCallableParamChange}
                          />
                          { paramField.optional
                            ? <Label
                              basic
                              pointing
                              color='teal'
                              content = { getOptionalMsg(interxType) }
                            />
                            : null
                          }

                        </span>
                      )}

                    ').signAndSend
                    ('
                      <InteractorSubmit
                        accountPair={accountPair}
                        setStatus={setStatus}
                        attrs={{ interxType, palletRpc, callable, inputParams, paramFields }}
                      />
                    ')
                    </code>
                    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
                  </Grid>
              };
            })
          ]
          }
        />
      </Container>
    </KittyInteractorStyleWrap>
  );
}

function InteractorSubmit (props) {
  return <TxGroupButton {...props} />;
}

export default function KittyInteractor (props) {
  const { api } = useSubstrate();
  return api.tx ? <Main {...props} /> : null;
}
