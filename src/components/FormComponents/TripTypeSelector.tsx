"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TripTypeSelectorProps {
	selectedType: string;
	onChange: (value: string) => void;
	onClearReturnDate?: () => void;
}

export const TripTypeSelector = ({
	selectedType,
	onChange,
	onClearReturnDate,
}: TripTypeSelectorProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleTripTypeChange = (value: string) => {
		onChange(value);

		const params = new URLSearchParams(searchParams.toString());
		params.set("type", value);

		// Clear returnDate if switching to one-way
		if (value === "one-way" && params.has("returnDate")) {
			params.delete("returnDate");
			if (onClearReturnDate) {
				toast({
					title: "Reset Return Date",
					description:
						"The return date has been reset because the trip is one-way.",
				});
				onClearReturnDate();
			}
		}

		router.push(`?${params.toString()}`);
	};

	useEffect(() => {
		const type = searchParams.get("type") || selectedType;
		onChange(type);

		if (!searchParams.get("type")) {
			const params = new URLSearchParams(searchParams.toString());
			params.set("type", selectedType);
			router.push(`?${params.toString()}`);
		}
	}, []);

	return (
		<div>
			<RadioGroup
				className="flex gap-4 lg:gap-10"
				value={selectedType}
				onValueChange={handleTripTypeChange}
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="roundtrip" id="roundtrip" />
					<Label
						className="text-xl font-normal hover:text-accent-foreground"
						htmlFor="roundtrip"
					>
						Roundtrip
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="one-way" id="one-way" />
					<Label
						className="text-xl font-normal hover:text-accent-foreground"
						htmlFor="one-way"
					>
						One-Way
					</Label>
				</div>
			</RadioGroup>
		</div>
	);
};
