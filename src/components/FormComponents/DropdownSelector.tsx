"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlightDestination } from "@/types/FlightDestination";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

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

	const handleChange = (value: FlightDestination) => {
		onChange(value);
		const params = new URLSearchParams(searchParams.toString());
		params.set(paramKey, value.code);
		router.push(`?${params.toString()}`);
	};

	return (
		<div>
			<Label>{label}</Label>
			<DropdownMenu>
				<DropdownMenuTrigger className="border px-4 py-2 rounded w-full text-left">
					{selectedOrigin
						? `${selectedOrigin.city} - ${selectedOrigin.airportName}`
						: `Select ${label}`}
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{options.map((option) => (
						<DropdownMenuItem
							key={option.code}
							onClick={() => handleChange(option)}
						>
							{option.city} - {option.airportName}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
