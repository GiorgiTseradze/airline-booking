"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useResponsiveBreakpoints } from "@/app/hooks/useResponsiveBreakpoints";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
	selectedDate: Date | undefined;
	onChange: (date: Date) => void;
	availableDays: number[];
	minDate?: Date;
	paramKey: string;
}

const getDisabledWeekdays = (availableWeekdays: number[]) => {
	const allWeekdays = [0, 1, 2, 3, 4, 5, 6];
	return allWeekdays.filter((day) => !availableWeekdays.includes(day));
};

const getSideOffset = (
	paramKey: string,
	breakpoints: { isLg: boolean; isXl: boolean }
) => {
	const { isLg, isXl } = breakpoints;

	if (isXl) return paramKey === "departureDate" ? 396 : 100;
	if (isLg) return paramKey === "departureDate" ? 346 : 50;
	return 5;
};

export default function DatePicker({
	selectedDate,
	onChange,
	availableDays = [],
	minDate,
	paramKey,
}: DatePickerProps) {
	const breakpoints = useResponsiveBreakpoints();
	const disabledDays = [
		...(minDate ? [{ before: minDate }] : []),
		{ dayOfWeek: getDisabledWeekdays(availableDays) },
	];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"border-2 text-gray-900 border-gray-400 text-xl h-auto rounded-full p-4 w-60 text-left bg-white flex items-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 justify-center font-normal",
						!selectedDate && "text-muted-foreground"
					)}
				>
					<span
						className={cn(selectedDate ? "truncate" : "truncate text-gray-500")}
					>
						{selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Pick a date"}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side={breakpoints.isLg ? "right" : undefined}
				sideOffset={getSideOffset(paramKey, breakpoints)}
				align={breakpoints.isLg ? "center" : undefined}
				className="w-auto p-0"
			>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => date && onChange(date)}
					disabled={disabledDays}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
