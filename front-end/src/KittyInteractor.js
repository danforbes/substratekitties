import React, { useEffect, useState } from 'react';
import { Grid, Input, Label, Tab } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxGroupButton } from './substrate-lib/components';

const argIsOptional = (arg) =>
  arg.type.toString().startsWith('Option<');

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;
  const [status, setStatus] = useState(null);

  const interxType = 'EXTRINSIC';
  const [callables, setCallables] = useState([]);
  const [paramFields, setParamFields] = useState([]);

  const initFormState = {
    palletRpc: 'substratekitties',
    callable: 'conjure',
    inputParams: []
  };

  const [formState, setFormState] = useState(initFormState);
  const { palletRpc, callable, inputParams } = formState;

  const updateCallables = () => {
    if (!api) { return; }
    const callables = Object.keys(api.tx.substratekitties).sort()
      .map(c => ({ key: c, value: c, text: c }));
    setCallables(callables);
  };

  const updateParamFields = () => {
    if (!api || callable === '') {
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
        // from dropdown or tab
        value === undefined
          ? res = { ...formState, [state]: callables[data.activeIndex].value, inputParams: [] }
          : res = { ...formState, [state]: value, inputParams: [] };
      }
      return res;
    });
  };

  const getOptionalMsg = (interxType) =>
    interxType === 'RPC'
      ? 'Optional Parameter'
      : 'Leaving this field as blank will submit a NONE value';

  return (
    <Tab
      state='callable'
      onTabChange={onPalletCallableParamChange}
      panes={
        callables.map(c => {
          return {
            menuItem: c.text,
            value: c.text,
            render: () =>
              <Grid>
                <Grid.Column width={8}>
                  api.tx.substratekitties.{c.text} ('

                  {paramFields.map((paramField, ind) =>
                    <div key={ind}>

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

                    </div>
                  )}

                  ')
                </Grid.Column>
                <Grid.Column width={3}>
                  <InteractorSubmit
                    accountPair={accountPair}
                    setStatus={setStatus}
                    attrs={{ interxType, palletRpc, callable, inputParams, paramFields }}
                  />
                </Grid.Column>
                <div style={{ overflowWrap: 'break-word' }}>{status}</div>
              </Grid>
          };
        })
      }
    />
  );
}

function InteractorSubmit (props) {
  return <TxGroupButton {...props} />;
}

export default function Interactor (props) {
  const { api } = useSubstrate();
  return api.tx ? <Main {...props} /> : null;
}
