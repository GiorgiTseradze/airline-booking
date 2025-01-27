"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FlightDestination } from "@/types/FlightDestination";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
				<DropdownMenuTrigger className="border-2 hover:bg-accent hover:text-accent-foreground text-gray-900 border-gray-400 text-xl rounded-full p-4 w-60 justify-center text-left bg-white flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
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
