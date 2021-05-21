import React, { useEffect, useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';
import { Base64Binary } from './utilities/Base64Binary';


function Main(props) {
    const { api } = useSubstrate();
    const { accountPair } = props;
    console.log("accountPair", accountPair)

    // The transaction submission status
    const [status, setStatus] = useState(null);

    const initFormState = {
        palletRpc: 'mantaPay',
        callable: 'init',
        inputParams: []
    }

    const [formState, setFormState] = useState(initFormState);
    const [inputParamMetas, setInputParamMetas] = useState([]);
    const [paramFields, setParamFields] = useState([]);
    const { palletRpc, callable, inputParams } = formState;

    const updateInputParamMetas = () => {
        let inputParamMetas = [{
            name: "merkle root",
            state: "merkle_root",
            type: "base64 string",
            jstype: "text",
            value: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
        }, {
            name: "old sn",
            state: "sn_old",
            type: "base64 string"
        }, {
            name: "old k",
            state: "k_old",
            jstype: "text",
            type: "base64 string"
        }, {
            name: "new k",
            state: "k_new",
            jstype: "text",
            type: "base64 string"
        }, {
            name: "new commitment",
            state: "cm_new",
            jstype: "text",
            type: "base64 string"
        }, {
            name: "encrypted transfer amount",
            state: "enc_amount",
            jstype: "text",
            type: "base64 string"
        }, {
            name: "proof",
            state: "proof",
            jstype: "text",
            type: "base64 string"
        }];

        setInputParamMetas(inputParamMetas);
        let paramFields = [];
        paramFields = inputParamMetas.map((_, ind) => true);
        setParamFields(paramFields);
    };

    useEffect(updateInputParamMetas, [api, callable]);

    const onCallableParamChange = (_, data) => {
        setFormState(formState => {
            let { state, value } = data;
            const { ind, paramMeta } = state;
            value = paramMeta.type === "base64 string" ? Base64Binary.decodeArrayBuffer(value) : value;
            const inputParams = [...formState.inputParams];
            inputParams[ind] = value;
            return {...formState, inputParams };
        });
    };

    const onCallableChange = (_, data) => {
        const formState = {...initFormState, callable: data.value };
        setFormState(formState);
    };

    return ( <
        Grid.Column width = { 8 } >
        <
        h1 > Private Payment < /h1> <
        Form >
{
            inputParamMetas.map((paramMeta, ind) =>
                <
                Form.Field key = { `${paramMeta.name}-${paramMeta.type}` } >
                <
                Input placeholder = { paramMeta.type }
                fluid type = { paramMeta.jstype }
                label = { paramMeta.name }
                state = {
                    { ind, paramMeta }
                }
                onChange = { onCallableParamChange }
                /> < /
                Form.Field >
            )
        } <
        Form.Field style = {
            { textAlign: 'center' }
        } >

        <
        TxButton accountPair = { accountPair }
        setStatus = { setStatus }
        label = 'Submit'
        type = 'SIGNED-TX'
        attrs = {
            {
                palletRpc: palletRpc,
                callable: callable,
                inputParams: inputParams,
                paramFields: paramFields
            }
        }
        /> < /
        Form.Field > <
        div style = {
            { overflowWrap: 'break-word' }
        } > { status } < /div> < /
        Form > <
        /Grid.Column>
    );
}

export default function Manta(props) {
    const { api } = useSubstrate();
    return api.tx.mantaPay ? < Main {...props }
    /> : null;
}
