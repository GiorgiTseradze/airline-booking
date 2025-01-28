"use client";

import React, { useMemo } from "react";
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

// Helper to calculate disabled weekdays
const getDisabledWeekdays = (availableWeekdays: number[]) => {
  const allWeekdays = [0, 1, 2, 3, 4, 5, 6];
  return allWeekdays.filter((day) => !availableWeekdays.includes(day));
};

// Helper to calculate side offset for the popover
const getSideOffset = (
  paramKey: string,
  { isLg, isXl }: { isLg: boolean; isXl: boolean }
) => {
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

  // Memoize the calculation of disabled days
  const disabledDays = useMemo(() => {
    const weekdaysDisabled = { dayOfWeek: getDisabledWeekdays(availableDays) };
    return minDate
      ? [{ before: minDate }, weekdaysDisabled]
      : [weekdaysDisabled];
  }, [availableDays, minDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={`Select a ${
            paramKey === "departureDate" ? "departure" : "return"
          } date`}
          className={cn(
            "border-2 border-gray-400 transition-all ease-in-out duration-150 hover:border-blue-500 hover:bg-transparent active:border-blue-700 text-gray-900 text-xl h-auto rounded-full p-4 w-60 text-left bg-white flex items-center shadow-sm outline-none focus:border-blue-600 justify-center font-normal",
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
        role="dialog"
        aria-label={`Date picker for ${
          paramKey === "departureDate" ? "departure" : "return"
        }`}
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
