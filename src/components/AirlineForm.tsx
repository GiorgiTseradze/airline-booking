"use client";

import { useState } from "react";
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
	const [loading, setLoading] = useState(false);
	const [tripType, setTripType] = useState("roundtrip");
	const [origin, setOrigin] = useState<FlightDestination | null>(null);
	const [destination, setDestination] = useState<FlightDestination | null>(
		null
	);
	const [departureDate, setDepartureDate] = useState<Date | undefined>();
	const [returnDate, setReturnDate] = useState<Date | undefined>();
	const router = useRouter();
	const searchParams = useSearchParams();

	// Central Validation checks
	const validations = {
		isSameCity: !!(origin && destination && origin.code === destination.code),
		isMissingRequiredFields:
			!origin ||
			!destination ||
			!departureDate ||
			(tripType === "roundtrip" && !returnDate),
	};

	// Clear forms state and params
	const clearForm = () => {
		setOrigin(null);
		setDestination(null);
		setDepartureDate(undefined);
		setReturnDate(undefined);
		setTripType("roundtrip");

		const params = new URLSearchParams(searchParams.toString());
		params.delete("origin");
		params.delete("destination");
		params.delete("departureDate");
		params.delete("returnDate");
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
				/>
			</div>
		</Bounded>
	);
};
