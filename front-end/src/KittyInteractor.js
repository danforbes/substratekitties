import React, { useEffect, useState } from 'react';
import { Container, Grid, Input, Tab } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxGroupButton } from './substrate-lib/components';

import KittyInteractorStyleWrap from './KittyInteractorStyleWrap';
import useKittyTab from './KittyHooks';

const argIsOptional = (arg) =>
  arg.type.toString().startsWith('Option<');

function Main (props) {
  const { api } = useSubstrate();
  const { kittyTab, setKittyTab } = useKittyTab();
  const { accountPair } = props;
  const [status, setStatus] = useState(null);

  const interxType = 'EXTRINSIC';
  const callables = Object.keys(api.tx.substratekitties).sort();

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

  useEffect(updateParamFields, [api, interxType, palletRpc, callable]);

  const onPalletCallableParamChange = (_, data) => {
    if (data.state === 'callable') {
      setKittyTab(callables[data.activeIndex - staticPanes.length]);
    }

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
        res = { ...formState, [state]: callables[data.activeIndex - staticPanes.length], inputParams: [] };
      }
      return res;
    });
  };

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
            callables.indexOf(kittyTab) !== -1
              ? callables.indexOf(kittyTab) + staticPanes.length
              : 0
          }
          state='callable'
          onTabChange={onPalletCallableParamChange}
          panes={[
            ...staticPanes,
            ...callables.map(callable => {
              return {
                menuItem: {
                  name: callable,
                  key: callable
                },
                value: callable,
                render: () =>
                  <Grid>
                    <code>
                      api.tx.substratekitties.{callable}('

                      {initparamFields(kittyTab).map((paramField, ind) =>
                        <span key={ind}>
                          <label>
                            {paramField.name}
                            {!paramField.optional && <sup>*</sup>}
                          </label>
                          <Input
                            placeholder={paramField.type}
                            type='text'
                            state={{ ind, paramField }}
                            value={ inputParams[ind] ? inputParams[ind].value : '' }
                            onChange={onPalletCallableParamChange}
                          />
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
