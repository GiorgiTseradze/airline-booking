"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FlightDestination } from "@/types/FlightDestination";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownSelectorProps {
	label: string;
	paramKey: "origin" | "destination";
	options: FlightDestination[];
	selectedOrigin: FlightDestination | null;
	onChange: (value: FlightDestination) => void;
}

export const DropdownSelector = ({
	label,
	paramKey,
	options,
	selectedOrigin,
	onChange,
}: DropdownSelectorProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Helper function to handle resetting dependent params
	const resetDependentParams = (
		params: URLSearchParams,
		key: "origin" | "destination"
	) => {
		if (key === "origin" && params.has("departureDate")) {
			params.delete("departureDate");
			toast({
				title: "Reset Departure Date",
				description:
					"The departure date has been reset because the origin changed.",
			});
		} else if (key === "destination" && params.has("returnDate")) {
			params.delete("returnDate");
			toast({
				title: "Reset Return Date",
				description:
					"The return date has been reset because the destination changed.",
			});
		}
	};

	const handleChange = (value: FlightDestination) => {
		onChange(value);
		const params = new URLSearchParams(searchParams.toString());
		resetDependentParams(params, paramKey);
		params.set(paramKey, value.code);
		router.push(`?${params.toString()}`);
	};

	useEffect(() => {
		const code = searchParams.get(paramKey);
		if (code) {
			const matchedOption = options.find((opt) => opt.code === code);
			if (
				matchedOption &&
				(!selectedOrigin || matchedOption.code !== selectedOrigin.code)
			) {
				onChange(matchedOption);
			}
		}
	}, []);

	return (
		<div className="relative">
			<Label className="absolute top-0 -translate-y-1/2 left-4 text-xs block p-2 bg-white font-medium text-gray-700 mb-1">
				{label}
			</Label>
			<DropdownMenu>
				<DropdownMenuTrigger
					aria-label={`Select ${label}`}
					className="border-2 text-gray-900 border-gray-400 text-xl rounded-full p-4 w-60 justify-center text-left bg-white flex items-center shadow-sm focus:outline-none transition-all ease-in-out duration-150 focus:ring-2 focus:ring-blue-500 hover:ring-2 hover:ring-blue-500 hover:bg-transparent"
				>
					<span className={cn("truncate", !selectedOrigin && "text-gray-500")}>
						{selectedOrigin ? selectedOrigin.city : `Select ${label}`}
					</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-60">
					{options.map((option) => (
						<DropdownMenuItem
							key={option.code}
							onClick={() => handleChange(option)}
							className="px-4 py-2 hover:bg-gray-100 text-lg rounded-lg cursor-pointer"
						>
							{option.city}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
