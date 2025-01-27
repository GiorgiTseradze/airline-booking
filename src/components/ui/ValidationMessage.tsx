import { cn } from "@/lib/utils";

interface ValidationMessageProps {
	isInvalid: boolean;
	message: string;
}

export const ValidationMessage = ({
	isInvalid,
	message,
}: ValidationMessageProps) => {
	return (
		<div
			className={cn(
				"mt-1 w-full text-xs ml-2 text-red-500 transition-all ease-in-out duration-300",
				isInvalid ? "opacity-100 max-h-20" : "opacity-0 max-h-0"
			)}
		>
			{message}
		</div>
	);
};
