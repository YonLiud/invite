import React from "react";
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: "sm" | "md" | "lg";
	children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	children,
	className = "",
	...props
}) => {
	const classes = [
		styles.button,
		styles[variant],
		styles[size],
		className
	].filter(Boolean).join(" ");

	return (
		<button className={classes} {...props}>
			{children}
		</button>
	);
};

export default Button;
