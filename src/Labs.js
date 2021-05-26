import React, { useState, useRef } from 'react';
import { Form, Grid, Header, Message, Label, Icon } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { base64Decode, base64Validate, base64Encode } from '@polkadot/util-crypto';

export default function Main ({ accountPair }) {
  const EXPECTED_PAYLOAD_SIZE_IN_BYTES = 608;

  const [sender1, setSender1] = useState('');
  const [sender2, setSender2] = useState('');
  const [receiver1, setReceiver1] = useState('');
  const [receiver2, setReceiver2] = useState('');
  const [proof, setProof] = useState('');
  const [status, setStatus] = useState(null);

  const fileUploadRef = useRef();
  const [uploadErrorText, setUploadErrorText] = useState('');

  const formatBase64StringForDisplay = base64String => {
    if (!base64String) {
      return '';
    }
    const LINE_LENGTH = 75;
    let formattedString = '';
    for (let i = 0; i < base64String.length; i++) {
      formattedString += base64String.slice(i, i + LINE_LENGTH);
      formattedString += '\n';
      i += LINE_LENGTH;
    }
    return formattedString;
  };

  const displayTransferInfo = transferInfoBytes => {
    setSender1(base64Encode(transferInfoBytes.slice(0, 96)));
    setSender2(base64Encode(transferInfoBytes.slice(97, 192)));
    setReceiver1(base64Encode(transferInfoBytes.slice(193, 304)));
    setReceiver2(base64Encode(transferInfoBytes.slice(305, 416)));
    setProof(base64Encode(transferInfoBytes.slice(317, 608)));
  };

  const validateFileUpload = fileText => {
    try {
      base64Validate(fileText);
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
    displayTransferInfo([]);
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
    <Grid.Column width={10}>
      <Header textAlign='center'>Private Transfer</Header>
      <Form>
        <Form.Field inline='true' style={{ textAlign: 'center' }}>
          <Label basic color='teal'>
              Upload a private payment file (608 bytes)
            </Label>
          <input
            accept='.txt'
            id='file'
            type='file'
            onChange={handleFileUpload}
            ref={fileUploadRef}
            style={{ marginLeft: 0, marginTop: '.5em', border: '0px'}}
          />
          <Message
            error
            onDismiss={() => setUploadErrorText('')}
            header='Upload failed'
            content={uploadErrorText}
            visible={uploadErrorText.length}
          />
        </Form.Field>
        <Form.Field>
          <p><b>Sender1:</b> {formatBase64StringForDisplay(sender1)}</p>
          <p><b>Sender2:</b> {formatBase64StringForDisplay(sender2)}</p>
          <p><b>Receiver1:</b> {formatBase64StringForDisplay(receiver1)}</p>
          <p><b>Receiver2:</b> {formatBase64StringForDisplay(receiver2)}</p>
          <p><b>Proof:</b> {formatBase64StringForDisplay(proof)}</p>
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'mantaPay',
              callable: 'privateTransfer',
              inputParams: [sender1, sender2, receiver1, receiver2, proof],
              paramFields: [true, true, true, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
