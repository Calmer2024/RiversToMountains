// src/components/IconButton.tsx
import React from 'react';
import { Button } from './Button';
import styles from './Header.module.scss'; // 使用 Header 的样式

interface IconButtonProps {
    icon: React.ReactNode;
    ariaLabel: string;
    onClick: () => void;
    className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
    icon, 
    ariaLabel, 
    onClick, 
    className = '' 
}) => {
    return (
        <Button
            variant="primary"
            className={`${styles.iconButton} ${className}`}
            aria-label={ariaLabel}
            onClick={onClick}
            style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                width: 'auto',
                height: 'auto',
            }}
        >
            {icon}
        </Button>
    );
};