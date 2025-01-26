"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/date-picker";

interface DateSelectorProps {
	label: string;
	paramKey: "departureDate" | "returnDate";
	selectedDate: Date | undefined;
	onChange: (date: Date | undefined) => void;
	availableDays: number[];
}

export const DateSelector = ({
	label,
	paramKey,
	selectedDate,
	onChange,
	availableDays,
}: DateSelectorProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleSelect = (date: Date | undefined) => {
		if (!date) return;
		onChange(date);
		const params = new URLSearchParams(searchParams.toString());
		if (date) {
			params.set(paramKey, date.toLocaleDateString("en-CA"));
		} else {
			params.delete(paramKey);
		}
		router.push(`?${params.toString()}`);
	};

	useEffect(() => {
		const dateParam = searchParams.get(paramKey);
		if (dateParam) {
			const parsedDate = new Date(dateParam);
			if (!isNaN(parsedDate.getTime())) {
				onChange(parsedDate);
			}
		}
	}, []);

	return (
		<div>
			<Label>{label}</Label>
			<DatePicker
				selectedDate={selectedDate}
				onChange={handleSelect}
				availableDays={availableDays}
			/>
		</div>
	);
};
