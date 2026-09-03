import { ReactNode } from 'react';

type Tone = 'cursando' | 'aprobada' | 'cursada' | 'muted' | 'accent' | 'danger';

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
}

export default function Badge({ tone = 'muted', children }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
