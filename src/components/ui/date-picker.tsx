"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
}
function getDisabledWeekdays(availableWeekdays: number[]) {
	const allWeekdays = [0, 1, 2, 3, 4, 5, 6];
	console.log(availableWeekdays, "wkds");
	return allWeekdays.filter((day) => !availableWeekdays.includes(day));
}
export default function DatePicker({
	selectedDate,
	onChange,
	availableDays = [],
	minDate,
}: DatePickerProps) {
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
			<PopoverContent className="w-auto p-0 absolute top-0 right-0">
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
