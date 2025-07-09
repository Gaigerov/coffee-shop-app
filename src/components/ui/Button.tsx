import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outlined';
    fullWidth?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string; // Добавляем className
    size?: 'small' | 'medium' | 'large'; // Добавляем size
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    onClick,
    type = 'button',
    disabled = false,
    className = '', // Значение по умолчанию
    size = 'medium', // Значение по умолчанию
}) => {
    const buttonClasses = [
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`], // Добавляем класс для размера
        fullWidth ? styles['button--fullWidth'] : '',
        disabled ? styles['button--disabled'] : '',
        className, // Добавляем переданный className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
