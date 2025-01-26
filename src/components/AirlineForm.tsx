"use client";

import { useState } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import DatePicker from "./ui/date-picker";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AirlineFormProps {
	destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
	const [tripType, setTripType] = useState("one-way");
	const [origin, setOrigin] = useState<FlightDestination | null>(null);
	const [destination, setDestination] = useState<FlightDestination | null>(
		null
	);
	const [departureDate, setDepartureDate] = useState<Date | undefined>();
	const [returnDate, setReturnDate] = useState<Date | undefined>();

	const handleDatePickerAvailability = (weekday: number) => {
		console.log("hi");
		if (!destination) return false;
		return !destination.availableWeekdays.includes(weekday);
	};

	return (
		<Bounded>
			<div className="flex flex-col gap-10">
				<h1 className="font-body font-bold text-xl text-center">
					Welcome to the Digido Airlines!
				</h1>

				<div>
					<Label>Origin</Label>
					<DropdownMenu>
						<DropdownMenuTrigger className="border px-4 py-2 rounded w-full text-left">
							{origin ? origin.city : "Select Origin"}
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{destinations.map((dest) => (
								<DropdownMenuItem
									key={dest.code}
									onClick={() => setOrigin(dest)}
								>
									{dest.city} - {dest.airportName}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div>
					<Label>Destination</Label>
					<DropdownMenu>
						<DropdownMenuTrigger className="border px-4 py-2 rounded w-full text-left">
							{destination ? destination.city : "Select Destination"}
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{destinations.map((dest) => (
								<DropdownMenuItem
									key={dest.code}
									onClick={() => setDestination(dest)}
								>
									{dest.city} - {dest.airportName}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div>
					<Label>Trip Type</Label>
					<RadioGroup
						value={tripType}
						onValueChange={(value) => setTripType(value)}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="one-way" id="one-way" />
							<Label htmlFor="one-way">One-Way</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="round-trip" id="round-trip" />
							<Label htmlFor="round-trip">Round-Trip</Label>
						</div>
					</RadioGroup>
				</div>

				<div>
					<Label>Departure Date</Label>
					<DatePicker
						selectedDate={departureDate}
						onSelect={(date) => setDepartureDate(date)}
						availableDays={origin ? origin.availableWeekdays : []}
					/>
				</div>
				{tripType === "round-trip" && (
					<div>
						<Label>Return Date</Label>
						<DatePicker
							selectedDate={returnDate}
							onSelect={(date) => setReturnDate(date)}
							availableDays={destination ? destination.availableWeekdays : []}
						/>
					</div>
				)}
			</div>
		</Bounded>
	);
};
