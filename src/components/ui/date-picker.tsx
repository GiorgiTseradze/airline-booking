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
}: DatePickerProps) {
	const disabledDays = { dayOfWeek: getDisabledWeekdays(availableDays) };
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-center text-left font-normal",
						!selectedDate && "text-muted-foreground"
					)}
				>
					{selectedDate ? (
						format(selectedDate, "dd/MM/yyyy")
					) : (
						<span>Pick a date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
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
