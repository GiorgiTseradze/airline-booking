"use client";

import { useState, useEffect } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import { useRouter, useSearchParams } from "next/navigation";
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
	const router = useRouter();
	const searchParams = useSearchParams();

	const [tripType, setTripType] = useState("one-way");
	const [origin, setOrigin] = useState<FlightDestination | null>(null);
	const [destination, setDestination] = useState<FlightDestination | null>(
		null
	);
	const [departureDate, setDepartureDate] = useState<Date | undefined>();
	const [returnDate, setReturnDate] = useState<Date | undefined>();

  const updateQuery = () => {
		const queryParams = new URLSearchParams();
		if (origin) queryParams.set("origin", origin.code);
		if (destination) queryParams.set("destination", destination.code);
		if (tripType) queryParams.set("type", tripType);
		if (departureDate)
			queryParams.set(
				"departureDate",
				departureDate.toISOString().split("T")[0]
			);
		if (returnDate)
			queryParams.set("returnDate", returnDate.toISOString().split("T")[0]);

		router.push(`?${queryParams.toString()}`);
	};

	useEffect(() => {
		const originCode = searchParams.get("origin");
		const destinationCode = searchParams.get("destination");
		const type = searchParams.get("type") || "one-way";
		const departure = searchParams.get("departureDate");
		const returnD = searchParams.get("returnDate");

		setTripType(type);
		if (originCode)
			setOrigin(destinations.find((d) => d.code === originCode) || null);
		if (destinationCode)
			setDestination(
				destinations.find((d) => d.code === destinationCode) || null
			);
		if (departure) setDepartureDate(new Date(departure));
		if (returnD) setReturnDate(new Date(returnD));
	}, [searchParams, destinations]);

	useEffect(() => {
		updateQuery();
	}, [origin, destination, tripType, departureDate, returnDate]);

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
