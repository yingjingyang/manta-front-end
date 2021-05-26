import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Message, Label, Icon } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { base64Decode, base64Validate, base64Encode } from '@polkadot/util-crypto';
import { formatBase64StringForDisplay } from './utils/FormatBase64StringForDisplay';


export default function Main ({ accountPair }) {
  const EXPECTED_PAYLOAD_SIZE_IN_BYTES = 608;

  const [transferInfo, setTransferInfo] = useState(null);
  const [sender1, setSender1] = useState('');
  const [sender2, setSender2] = useState('');
  const [receiver1, setReceiver1] = useState('');
  const [receiver2, setReceiver2] = useState('');
  const [proof, setProof] = useState('');
  const [status, setStatus] = useState(null);

  const fileUploadRef = useRef();
  const [uploadErrorText, setUploadErrorText] = useState('');

  const displayTransferInfo = transferInfoBytes => {
    setTransferInfo(transferInfoBytes)
    setSender1(base64Encode(transferInfoBytes.slice(0, 96)));
    setSender2(base64Encode(transferInfoBytes.slice(96, 192)));
    setReceiver1(base64Encode(transferInfoBytes.slice(192, 304)));
    setReceiver2(base64Encode(transferInfoBytes.slice(304, 416)));
    setProof(base64Encode(transferInfoBytes.slice(416, 608)));
  };

  const hideTransferInfo = transferInfoBytes => {
    setTransferInfo(null)
    setSender1(null)
    setSender2(null);
    setReceiver1(null);
    setReceiver2(null);
    setProof(null);
  };

  const validateFileUpload = fileText => {
    try {
      base64Validate(fileText.trim());
    } catch (error) {
      fileUploadRef.current.value = null;
      setUploadErrorText('File is not valid base64');
      return false;
    }
    const bytes = base64Decode(fileText.trim());
    if (bytes.length !== EXPECTED_PAYLOAD_SIZE_IN_BYTES) {
      fileUploadRef.current.value = null;
      setUploadErrorText(`File is ${bytes.length} bytes, expected 608`);
      return false;
    }
    return true;
  };

  const handleFileUpload = () => {
    setUploadErrorText('');
    hideTransferInfo();
    const file = fileUploadRef.current.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (readerEvent) => {
      const text = (readerEvent.target.result);
      if (validateFileUpload(text)) {
        displayTransferInfo(base64Decode(text));
      }
    };
  };

  return (
    <>
      <Grid.Column width={2}/>
      <Grid.Column width={12} textAlign='center'>
        <Header textAlign='center'>Private Transfer</Header>
        <Form>
          <Label basic color='teal'>
            Upload a private transfer file (608 bytes)
          </Label>
          <Form.Field inline='true' style={{ textAlign: 'center' }}>
            <input
              accept='.txt'
              id='file'
              type='file'
              onChange={handleFileUpload}
              ref={fileUploadRef}
              style={{paddingLeft: '9em', paddingTop: '1em', border: '0px'}}
            />
            <Message
              error
              onDismiss={() => setUploadErrorText('')}
              header='Upload failed'
              content={uploadErrorText}
              visible={uploadErrorText.length}
            />
          </Form.Field>
          {transferInfo &&
            <Form.Field style={{maxWidth: '40%', textAlign: 'left', paddingLeft:'19em'}}>
              <p><b>Sender1:</b>{formatBase64StringForDisplay(sender1)}</p>
              <p><b>Sender2:</b>{formatBase64StringForDisplay(sender2)}</p>
              <p><b>Receiver1:</b>{formatBase64StringForDisplay(receiver1)}</p>
              <p><b>Receiver2:</b>{formatBase64StringForDisplay(receiver2)}</p>
              <p><b>Proof:</b>{formatBase64StringForDisplay(proof)}</p>
            </Form.Field>
          }
          <Form.Field style={{ textAlign: 'center' }}>
            <TxButton
              accountPair={accountPair}
              label='Submit'
              type='SIGNED-TX'
              setStatus={setStatus}
              attrs={{
                palletRpc: 'mantaPay',
                callable: 'privateTransfer',
                inputParams: [transferInfo],
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
