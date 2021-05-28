import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Message, Label } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { base64Decode, base64Validate, base64Encode } from '@polkadot/util-crypto';
import { formatBase64StringForDisplay } from './utils/FormatBase64StringForDisplay';
import BN from 'bn.js';

export default function Main ({ accountPair }) {
  const EXPECTED_PAYLOAD_SIZE_IN_BYTES = 512;

  const [reclaimInfo, setReclaimInfo] = useState(null);
  const [assetID, setAssetID] = useState(null);
  const [reclaimAmount, setReclaimAmount] = useState(null);
  const [sender1, setSender1] = useState(null);
  const [sender2, setSender2] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [proof, setProof] = useState(null);

  const [status, setStatus] = useState(null);
  const [uploadErrorText, setUploadErrorText] = useState('');
  const fileUploadRef = useRef();

  const displayReclaimInfo = reclaimInfoBytes => {
    setAssetID(new BN(reclaimInfoBytes.slice(0, 8), 10, 'le'));
    setReclaimAmount(new BN(reclaimInfoBytes.slice(8, 16), 10, 'le'));
    setSender1(base64Encode(reclaimInfoBytes.slice(16, 112)));
    setSender2(base64Encode(reclaimInfoBytes.slice(112, 208)));
    setReceiver(base64Encode(reclaimInfoBytes.slice(208, 320)));
    setProof(base64Encode(reclaimInfoBytes.slice(320, 512)));
    setReclaimInfo(reclaimInfoBytes);
  };

  const hideReclaimInfo = () => {
    setReclaimInfo(null);
    setAssetID(null);
    setReclaimAmount(null);
    setSender1(null);
    setSender2(null);
    setReceiver(null);
    setProof(null);
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
    hideReclaimInfo();
    const file = fileUploadRef.current.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (readerEvent) => {
      const text = (readerEvent.target.result.trim());
      if (validateFileUpload(text)) {
        displayReclaimInfo(base64Decode(text));
      }
    };
  };
  console.log('assetID', assetID);

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12}>
        <Header textAlign='center'>Reclaim Private Asset</Header>
        <Form>
          <Label basic color='teal'>
            Upload a reclaim file (512 bytes)
          </Label>
          <Form.Field inline='true' style={{ textAlign: 'center' }}>
            <input
              accept='.txt'
              id='file'
              type='file'
              onChange={handleFileUpload}
              ref={fileUploadRef}
              style={{ paddingLeft: '9em', paddingTop: '1em', border: '0px' }}
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
            reclaimInfo
              ? <Form.Field style={{ maxWidth: '40%', textAlign: 'left', paddingLeft: '19em' }}>
                <p><b>Asset ID:</b>{'\n'}{assetID.toString(10)}</p>
                <p><b>Reclaim amount:</b>{'\n'}{reclaimAmount.toString(10)}</p>
                <p><b>Sender1:</b>{formatBase64StringForDisplay(sender1)}</p>
                <p><b>Sender2:</b>{formatBase64StringForDisplay(sender2)}</p>
                <p><b>Receiver:</b>{formatBase64StringForDisplay(receiver)}</p>
                <p><b>Proof:</b>{formatBase64StringForDisplay(proof)}</p>
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
                callable: 'reclaim',
                inputParams: [reclaimInfo],
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
