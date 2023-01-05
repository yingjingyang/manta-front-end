import { ReactNode } from 'react';

type Status = 'available' | 'registered' | 'not-available';
export type StatusButtonProps = {
  status: Status;
  children: ReactNode;
};
const clsMap: Record<Status, string> = {
  available: 'success',
  registered: 'register',
  'not-available': 'error'
};
const StatusButton = ({ status, children }: StatusButtonProps) => {
  return (
    <button
      className={`px-4 py-1.5 rounded-full border border-manta-${clsMap[status]} text-manta-${clsMap[status]}`}>
      {children}
    </button>
  );
};
export default StatusButton;
