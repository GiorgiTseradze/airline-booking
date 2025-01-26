"use client";

import { useState } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import Bounded from "./Bounded";
import clsx from "clsx";
import { TripTypeSelector } from "./FormComponents/TripTypeSelector";
import { DropdownSelector } from "./FormComponents/DropdownSelector";
import { DateSelector } from "./FormComponents/DateSelector";
import { submitForm } from "@/app/actions/form-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

interface AirlineFormProps {
	destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [tripType, setTripType] = useState("one-way");
	const [origin, setOrigin] = useState<FlightDestination | null>(null);
	const [destination, setDestination] = useState<FlightDestination | null>(
		null
	);
	const [departureDate, setDepartureDate] = useState<Date | undefined>();
	const [returnDate, setReturnDate] = useState<Date | undefined>();

	const handleSubmit = async () => {
		try {
			setLoading(true);

			if (!origin || !destination || !departureDate) {
				throw new Error("Please fill in all required fields.");
			}

			const formData = {
				origin: origin.code,
				destination: destination.code,
				type: tripType,
				departureDate: departureDate.toLocaleDateString("en-CA"),
				returnDate: returnDate ? returnDate.toLocaleDateString("en-CA") : null,
			};

			const result = await submitForm(formData);

			setResponse(`Success! Booking ID: ${result.bookingId}`);
		} catch (error) {
			console.error("Error submitting form:", error);
			setResponse("Error submitting the form. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Bounded>
			<div className="flex flex-col gap-10">
				<h1 className="font-body font-bold text-xl text-center">
					Welcome to Digido Airlines!
				</h1>

				<DropdownSelector
					label="Origin"
					paramKey="origin"
					selectedOrigin={origin}
					onChange={setOrigin}
					options={destinations}
				/>

				<DropdownSelector
					label="Destination"
					paramKey="destination"
					selectedOrigin={destination}
					onChange={setDestination}
					options={destinations}
				/>

				<TripTypeSelector selectedType={tripType} onChange={setTripType} />

				<DateSelector
					label="Departure Date"
					paramKey="departureDate"
					selectedDate={departureDate}
					onChange={setDepartureDate}
					availableDays={destinations[0]?.availableWeekdays || []}
				/>

				<div
					className={clsx(
						"transition-all ease-in-out duration-500 overflow-hidden",
						tripType === "round-trip"
							? "max-h-40 opacity-100"
							: "max-h-0 opacity-0"
					)}
				>
					<DateSelector
						label="Return Date"
						paramKey="returnDate"
						selectedDate={returnDate}
						onChange={setReturnDate}
						availableDays={destinations[1]?.availableWeekdays || []}
					/>
				</div>

				<SubmitButton onClick={handleSubmit} loading={loading}>
					Submit
				</SubmitButton>

				{response && <p className="text-center mt-4">{response}</p>}
			</div>
		</Bounded>
	);
};
