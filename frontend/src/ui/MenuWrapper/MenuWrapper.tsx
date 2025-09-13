import React, { useState } from "react";
import styles from "./MenuWrapper.module.scss";

export interface MenuOption {
	id: string;
	label: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	danger?: boolean;
}

export interface MenuWrapperProps {
	children: React.ReactNode;
	options: MenuOption[];
	position?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
	className?: string;
	disabled?: boolean;
	trigger?: "hover" | "click";
}

const MenuWrapper: React.FC<MenuWrapperProps> = ({
	children,
	options,
	position = "bottom-right",
	className = "",
	disabled = false,
	trigger = "hover"
}) => {
	const [isVisible, setIsVisible] = useState(false);

	const handleMouseEnter = () => {
		if (trigger === "hover" && !disabled) {
			setIsVisible(true);
		}
	};

	const handleMouseLeave = () => {
		if (trigger === "hover") {
			setIsVisible(false);
		}
	};

	const handleClick = () => {
		if (trigger === "click" && !disabled) {
			setIsVisible(!isVisible);
		}
	};

	const handleOptionClick = (option: MenuOption) => {
		if (!option.disabled && option.onClick) {
			option.onClick();
		}
		if (trigger === "click") {
			setIsVisible(false);
		}
	};

	const wrapperClasses = [
		styles.wrapper,
		disabled && styles.disabled,
		className
	].filter(Boolean).join(" ");

	const menuClasses = [
		styles.menu,
		styles[position],
		isVisible && styles.visible
	].filter(Boolean).join(" ");

	return (
		<div
			className={wrapperClasses}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		>
			{children}
			{!disabled && (
				<div className={menuClasses}>
					<div className={styles.menuContent}>
						{options.map((option) => (
							<button
								key={option.id}
								className={`${styles.menuItem} ${option.danger ? styles.danger : ""} ${option.disabled ? styles.disabled : ""}`}
								onClick={() => handleOptionClick(option)}
								disabled={option.disabled}
							>
								{option.icon && (
									<span className={styles.icon}>
										{option.icon}
									</span>
								)}
								<span className={styles.label}>
									{option.label}
								</span>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MenuWrapper;