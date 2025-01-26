import { ButtonHTMLAttributes } from "react";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
}

export const SubmitButton = ({
	loading,
	children,
	...props
}: SubmitButtonProps) => {
	return (
		<button
			{...props}
			className={`bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 ${
				props.className || ""
			}`}
			disabled={loading || props.disabled}
		>
			{loading ? "Submitting..." : children}
		</button>
	);
};
