"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitForm } from "@/app/actions/form-actions";
import { toast } from "@/hooks/use-toast";
import { FlightDestination } from "@/types/FlightDestination";
import { TripTypeSelector } from "@/components/FormComponents/TripTypeSelector";
import { DropdownSelector } from "@/components/FormComponents/DropdownSelector";
import { DateSelector } from "@/components/FormComponents/DateSelector";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { ToastDescription } from "@/components/ui/ToastDescription";
import Bounded from "@/components/Bounded";

interface AirlineFormProps {
	destinations: FlightDestination[];
}

export const AirlineForm = ({ destinations }: AirlineFormProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [tripType, setTripType] = useState("roundtrip");
	const [origin, setOrigin] = useState<FlightDestination | null>(null);
	const [destination, setDestination] = useState<FlightDestination | null>(
		null
	);
	const [departureDate, setDepartureDate] = useState<Date | undefined>();
	const [returnDate, setReturnDate] = useState<Date | undefined>();

	// Central Validation checks
	const validations = useMemo(() => ({
		isSameCity: !!(origin && destination && origin.code === destination.code),
		isMissingRequiredFields:
			!origin ||
			!destination ||
			!departureDate ||
			(tripType === "roundtrip" && !returnDate),
	}), [origin, destination, departureDate, returnDate, tripType]);

	// Function to safely set the origin and validate the departure date
	const handleOriginChange = (value: FlightDestination | null) => {
		setOrigin(value);

		// If the current departure date is not available in the new origin's weekdays, reset it
		if (departureDate && value && !value.availableWeekdays.includes(departureDate.getDay())) {
			setDepartureDate(undefined);
		}
	};

	// Function to set the destination and validate the return date
	const handleDestinationChange = (value: FlightDestination | null) => {
		setDestination(value);

		// If the current return date is not available in the new destination's weekdays, reset it
		if (returnDate && value && !value.availableWeekdays.includes(returnDate.getDay())) {
			setReturnDate(undefined);
		}
	};
	

	// Clear forms state and params
	const clearForm = () => {
		setOrigin(null);
		setDestination(null);
		setDepartureDate(undefined);
		setReturnDate(undefined);
		setTripType("roundtrip");

		const params = new URLSearchParams(searchParams.toString());
		
	  ["origin", "destination", "departureDate", "returnDate"].forEach((key) =>
			params.delete(key)
		);

		router.push(`?${params.toString()}`);
	};

	async function handleSubmit() {
		try {
			setLoading(true);

			const formData = {
				origin: origin?.code ?? "",
				destination: destination?.code ?? "",
				type: tripType,
				departureDate: departureDate?.toLocaleDateString("en-CA") ?? "",
				returnDate: returnDate ? returnDate.toLocaleDateString("en-CA") : null,
			};

			const result = await submitForm(formData);

			// Show toast with booking response details
			toast({
				title: "Success!",
				description: (
					<ToastDescription
						details={[
							{ label: "Booking ID", value: result.bookingId },
							{ label: "Status", value: result.status },
							{
								label: "Timestamp",
								value: new Date(result.timestamp).toLocaleString(),
							},
						]}
					/>
				),
				className: "border border-green-500 bg-green-50 max-w-sm mx-auto p-4",
			});
			clearForm();
		} catch (error) {
			console.error("Error submitting form:", error);
			toast({
				title: "Error",
				description: "Error submitting the form. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<Bounded>
			<div className="relative lg:mt-24 flex flex-col items-center lg:items-start gap-6 lg:gap-10">
				<div className="relative w-60 lg:w-auto">
					<div className="flex flex-col gap-5 lg:gap-14 lg:flex-row">
						<DropdownSelector
							label="Origin"
							paramKey="origin"
							selectedOrigin={origin}
							onChange={handleOriginChange}
							options={destinations}
						/>

						<DropdownSelector
							label="Destination"
							paramKey="destination"
							selectedOrigin={destination}
							onChange={handleDestinationChange}
							options={destinations}
						/>
					</div>
					<ValidationMessage
						isInvalid={validations.isSameCity}
						message="Origin and destination cannot be the same."
						aria-live="polite"
					/>
				</div>

				<div className="flex flex-col gap-5 lg:gap-14 lg:flex-row">
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
					aria-live="polite"
				/>
			</div>
		</Bounded>
	);
};
