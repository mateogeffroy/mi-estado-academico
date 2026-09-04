const getInitials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <div className={['avatar', `avatar-${size}`, className].filter(Boolean).join(' ')} title={name}>
      {src ? <img src={src} alt={name} /> : getInitials(name)}
    </div>
  );
}
