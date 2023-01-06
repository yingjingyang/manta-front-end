import { ButtonHTMLAttributes, ReactNode } from 'react';

type Status = 'available' | 'registered' | 'not-available';
export type StatusButtonProps = {
  status: Status;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'status' | 'children'>;
const clsMap: Record<Status, string> = {
  available: 'success',
  registered: 'register',
  'not-available': 'error'
};
const StatusButton = ({
  status,
  children,
  className,
  ...otherProps
}: StatusButtonProps) => {
  return (
    <button
      {...otherProps}
      className={`px-4 py-1.5 rounded-full border border-manta-${clsMap[status]} text-manta-${clsMap[status]} ${className}`}>
      {children}
    </button>
  );
};
export default StatusButton;
