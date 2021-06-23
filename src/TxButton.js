import React from 'react';
import { Button } from 'semantic-ui-react';

export default function TxButton ({
  onClick,
  label,
  color,
  style,
  disabled
}) {
  return (
    <Button
      basic
      color={color}
      style={style}
      type='submit'
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
