import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
	message: string;
	disabled?: boolean;
}

export const SubmitButton = ({
	loading,
	message,
	disabled = false,
	...props
}: SubmitButtonProps) => {
	return (
		<button
			{...props}
			className={clsx(
				"bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 w-fit rounded-3xl transition-opacity",
				"focus:outline-none focus:ring focus:ring-blue-300 focus:ring-offset-2",
				disabled || loading ? "opacity-50 pointer-events-none" : "opacity-100",
				props.className
			)}
			disabled={loading || disabled}
		>
			{loading ? "Submitting..." : message}
		</button>
	);
};
