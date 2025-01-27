import clsx from "clsx";

interface ToastDescriptionProps {
	details: {
		label: string;
		value: string;
	}[];
	className?: string;
}

export const ToastDescription = ({
	details,
	className,
}: ToastDescriptionProps) => {
	return (
		<div className={clsx("space-y-2 text-sm text-gray-700", className)}>
			{details.map((detail, index) => (
				<p key={index}>
					<strong>{detail.label}:</strong> {detail.value}
				</p>
			))}
		</div>
	);
};
