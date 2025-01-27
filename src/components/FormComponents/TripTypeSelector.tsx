"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";

interface TripTypeSelectorProps {
	selectedType: string;
	onChange: (value: string) => void;
}

export const TripTypeSelector = ({
	selectedType,
	onChange,
}: TripTypeSelectorProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleTripTypeChange = (value: string) => {
		onChange(value);
		const params = new URLSearchParams(searchParams.toString());
		params.set("type", value);
		router.push(`?${params.toString()}`);
	};

	useEffect(() => {
		const type = searchParams.get("type") || "one-way";
		onChange(type);

		if (!searchParams.get("type")) {
			const params = new URLSearchParams(searchParams.toString());
			params.set("type", "one-way");
			router.push(`?${params.toString()}`);
		}
	}, []);

	return (
		<div>
			<RadioGroup
				className="flex gap-4"
				value={selectedType}
				onValueChange={handleTripTypeChange}
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="one-way" id="one-way" />
					<Label className="hover:text-accent-foreground" htmlFor="one-way">
						One-Way
					</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="roundtrip" id="roundtrip" />
					<Label className="hover:text-accent-foreground" htmlFor="roundtrip">
						Roundtrip
					</Label>
				</div>
			</RadioGroup>
		</div>
	);
};
