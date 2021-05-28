import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Message, Label } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { base64Decode, base64Validate, base64Encode } from '@polkadot/util-crypto';
import BN from 'bn.js';

export default function Main ({ accountPair }) {
  const EXPECTED_PAYLOAD_SIZE_IN_BYTES = 112;

  const [mintInfo, setMintInfo] = useState(null);
  const [assetID, setAssetID] = useState(null);
  const [mintAmount, setMintAmount] = useState(null);
  const [cm, setCm] = useState(null);
  const [k, setK] = useState(null);
  const [s, setS] = useState(null);

  const [status, setStatus] = useState(null);
  const [uploadErrorText, setUploadErrorText] = useState('');
  const fileUploadRef = useRef();

  const displayMintInfo = transferInfoBytes => {
    setAssetID(new BN(transferInfoBytes.slice(0, 8), 10, 'le'));
    setMintAmount(new BN(transferInfoBytes.slice(8, 16), 10, 'le'));
    setCm(base64Encode(transferInfoBytes.slice(16, 48)));
    setK(base64Encode(transferInfoBytes.slice(48, 80)));
    setS(base64Encode(transferInfoBytes.slice(80, 112)));
    setMintInfo(transferInfoBytes);
  };

  const hideMintInfo = transferInfoBytes => {
    setMintInfo(null);
    setAssetID(null);
    setMintAmount(null);
    setCm(null);
    setK(null);
    setS(null);
  };

  const validateFileUpload = fileText => {
    try {
      base64Validate(fileText);
    } catch (error) {
      fileUploadRef.current.value = null;
      setUploadErrorText('File is not valid base64');
      return false;
    }
    const bytes = base64Decode(fileText);
    if (bytes.length !== EXPECTED_PAYLOAD_SIZE_IN_BYTES) {
      fileUploadRef.current.value = null;
      setUploadErrorText(`File is ${bytes.length} bytes, expected ${EXPECTED_PAYLOAD_SIZE_IN_BYTES}`);
      return false;
    }
    return true;
  };

  const handleFileUpload = () => {
    setUploadErrorText('');
    hideMintInfo();
    const file = fileUploadRef.current.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (readerEvent) => {
      const text = (readerEvent.target.result.trim());
      if (validateFileUpload(text)) {
        displayMintInfo(base64Decode(text));
      }
    };
  };

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={10}>
        <Header textAlign='center'>Mint Private Asset</Header>
        <Form>
          <Label basic color='teal'>
            Upload a mint file (112 bytes)
          </Label>
          <Form.Field inline='true' style={{ textAlign: 'center' }}>
            <input
              accept='.txt'
              id='file'
              type='file'
              onChange={handleFileUpload}
              ref={fileUploadRef}
              style={{ marginLeft: '8em', paddingTop: '1em', border: '0px' }}
            />
            <Message
              error
              onDismiss={() => setUploadErrorText('')}
              header='Upload failed'
              content={uploadErrorText}
              visible={uploadErrorText.length}
            />
          </Form.Field>
          {
            mintInfo
              ? <Form.Field style={{ maxWidth: '40%', textAlign: 'left', paddingLeft: '4em' }}>
                <p><b>Asset ID:</b>{'\n'}{assetID.toString(10)}</p>
                <p><b>Mint amount:</b>{'\n'}{mintAmount.toString(10)}</p>
                <p><b>cm:</b>{'\n'}{cm}</p>
                <p><b>k:</b>{'\n'}{k}</p>
                <p><b>s:</b>{'\n'}{s}</p>
              </Form.Field>
              : <div/>
          }
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              accountPair={accountPair}
              label='Submit'
              type='SIGNED-TX'
              setStatus={setStatus}
              attrs={{
                palletRpc: 'mantaPay',
                callable: 'mintPrivateAsset',
                inputParams: [mintInfo],
                paramFields: [true]
              }}
            />
          </Form.Field>
          <div style={{ overflowWrap: 'break-word' }}>{status}</div>
        </Form>
      </Grid.Column>
      <Grid.Column width={2}/>
    </>
  );
}
