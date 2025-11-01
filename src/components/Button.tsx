// src/components/Button.tsx

import React, { type ReactNode, type ButtonHTMLAttributes, type FC } from 'react';
import styles from './Button.module.scss';

// 1. 定义 props 类型
type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

// 2. 创建 Button 组件
export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  const buttonClassName = `
    ${styles.button}
    ${variant === 'primary' ? styles.primary : styles.secondary}
    ${className || ''}
  `;

  return (
    <button className={buttonClassName.trim()} {...props}>
      {children}
    </button>
  );
};