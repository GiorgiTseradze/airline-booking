"use client";

import { useState } from "react";
import { FlightDestination } from "@/types/FlightDestination";
import clsx from "clsx";
import { TripTypeSelector } from "./FormComponents/TripTypeSelector";
import { DropdownSelector } from "./FormComponents/DropdownSelector";
import { DateSelector } from "./FormComponents/DateSelector";
import { submitForm } from "@/app/actions/form-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Bounded from "@/components/Bounded";
import { ValidationMessage } from "./ui/ValidationMessage";

interface AirlineFormProps {
	destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [tripType, setTripType] = useState("roundtrip");
	const [origin, setOrigin] = useState<FlightDestination | null>(null);
	const [destination, setDestination] = useState<FlightDestination | null>(
		null
	);
	const [departureDate, setDepartureDate] = useState<Date | undefined>();
	const [returnDate, setReturnDate] = useState<Date | undefined>();

	const validations = {
		isSameCity: !!(origin && destination && origin.code === destination.code),
		isMissingRequiredFields:
			!origin ||
			!destination ||
			!departureDate ||
			(tripType === "roundtrip" && !returnDate),
	};

	async function handleSubmit() {
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
	}

	return (
		<Bounded>
			<div className="relative lg:mt-24 flex flex-col items-center lg:items-start gap-6 lg:gap-10">
				<div className="relative w-60 lg:w-auto">
					<div className="flex flex-col gap-4 lg:gap-14 lg:flex-row">
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
					</div>
					<ValidationMessage
						isInvalid={validations.isSameCity}
						message="Origin and destination cannot be the same."
					/>
				</div>

				<div className="flex flex-col gap-4 lg:gap-14 lg:flex-row">
					<DateSelector
						label="From"
						paramKey="departureDate"
						selectedDate={departureDate}
						onChange={setDepartureDate}
						availableDays={origin?.availableWeekdays || []}
						disabled={!origin}
					/>

					<DateSelector
						label="To"
						paramKey="returnDate"
						selectedDate={returnDate}
						onChange={setReturnDate}
						availableDays={destination?.availableWeekdays || []}
						minDate={departureDate}
						disabled={tripType !== "roundtrip" || !destination}
					/>
				</div>

				<TripTypeSelector
					selectedType={tripType}
					onChange={setTripType}
					onClearReturnDate={() => setReturnDate(undefined)}
				/>

				<SubmitButton
					onClick={handleSubmit}
					loading={loading}
					disabled={
						validations.isSameCity || validations.isMissingRequiredFields
					}
					message="Book Flight"
				/>

				{response && <p className="text-center mt-4">{response}</p>}
			</div>
		</Bounded>
	);
};
