import { useEffect, useRef } from 'react';

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useCompare = value => {
  const prevValue = usePrevious(value);
  return prevValue !== value;
};
