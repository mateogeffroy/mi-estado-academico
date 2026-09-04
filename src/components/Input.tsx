import { InputHTMLAttributes, forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={['input-field', className].filter(Boolean).join(' ')} {...props} />
  )
);
Input.displayName = 'Input';

export default Input;
