import { ReactNode } from 'react';

interface AlertProps {
  type: 'success' | 'danger';
  children: ReactNode;
}

export default function Alert({ type, children }: AlertProps) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
