import React from 'react';
import { Button } from 'semantic-ui-react';

export default function TxButton ({
  onClick,
  label,
  disabled
}) {
  return (
    <Button
      type='submit'
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
