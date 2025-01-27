"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/date-picker";
import clsx from "clsx";

interface DateSelectorProps {
	label: string;
	paramKey: "departureDate" | "returnDate";
	selectedDate: Date | undefined;
	onChange: (date: Date | undefined) => void;
	availableDays: number[];
	minDate?: Date | undefined;
	disabled?: boolean;
}

export const DateSelector = ({
	label,
	paramKey,
	selectedDate,
	onChange,
	availableDays,
	minDate = new Date(),
	disabled = false,
}: DateSelectorProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleSelect = (date: Date) => {
		if (!date) return;
		onChange(date);
		const params = new URLSearchParams(searchParams.toString());
		params.set(paramKey, date.toLocaleDateString("en-CA"));
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
		<div
			className={clsx("relative transition-all ease-in-out duration-500", {
				"pointer-events-none opacity-30": disabled,
			})}
		>
			<Label className="absolute top-0 -translate-y-1/2 left-4 text-xs block p-2 bg-white font-medium text-gray-700 mb-1">
				{label}
			</Label>

			<DatePicker
				selectedDate={selectedDate}
				onChange={handleSelect}
				availableDays={availableDays}
				minDate={minDate}
				paramKey={paramKey}
			/>
		</div>
	);
};
