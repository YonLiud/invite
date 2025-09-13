import React from "react";
import MenuWrapper, { type MenuOption } from "../ui/MenuWrapper";
import Button from "../ui/Button/Button";

// Example usage of MenuWrapper component
const MenuWrapperExample: React.FC = () => {
	const menuOptions: MenuOption[] = [
		{
			id: "edit",
			label: "Edit",
			icon: <span>✏️</span>,
			onClick: () => console.log("Edit clicked")
		},
		{
			id: "share",
			label: "Share",
			icon: <span>🔗</span>,
			onClick: () => console.log("Share clicked")
		},
		{
			id: "duplicate",
			label: "Duplicate",
			icon: <span>📋</span>,
			onClick: () => console.log("Duplicate clicked")
		},
		{
			id: "separator",
			label: "Disabled Option",
			disabled: true,
			onClick: () => console.log("This won't fire")
		},
		{
			id: "delete",
			label: "Delete",
			icon: <span>🗑️</span>,
			danger: true,
			onClick: () => console.log("Delete clicked")
		}
	];

	return (
		<div style={{ padding: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
			{/* Hover trigger example */}
			<MenuWrapper options={menuOptions} position="bottom-right">
				<Button variant="primary">Hover for Menu</Button>
			</MenuWrapper>

			{/* Click trigger example */}
			<MenuWrapper options={menuOptions} position="bottom-left" trigger="click">
				<Button variant="outline">Click for Menu</Button>
			</MenuWrapper>

			{/* Different positions */}
			<MenuWrapper options={menuOptions} position="top">
				<Button variant="secondary">Top Menu</Button>
			</MenuWrapper>

			<MenuWrapper options={menuOptions} position="right">
				<Button variant="success">Right Menu</Button>
			</MenuWrapper>

			{/* Disabled example */}
			<MenuWrapper options={menuOptions} disabled>
				<Button variant="danger">Disabled Menu</Button>
			</MenuWrapper>

			{/* Custom content */}
			<MenuWrapper options={menuOptions} position="bottom-right">
				<div style={{
					padding: "1rem",
					border: "2px dashed #ccc",
					borderRadius: "8px",
					textAlign: "center"
				}}>
					Hover me!<br />
					<small>Any content can be wrapped</small>
				</div>
			</MenuWrapper>
		</div>
	);
};

export default MenuWrapperExample;