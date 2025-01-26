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
	onSelect: (date: Date) => void;
	disabled?: boolean;
}

export default function DatePicker({
	selectedDate,
	onSelect,
	disabled = false,
}: DatePickerProps) {
	console.log(selectedDate, "date");
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
					onSelect={(date) => date && onSelect(date)}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
