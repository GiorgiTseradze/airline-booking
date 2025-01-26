"use server";

export async function submitForm(formData: {
	origin: string;
	destination: string;
	type: string;
	departureDate: string;
	returnDate?: string | null;
}) {
	const AUTH_KEY = process.env.AUTH_KEY;
	const API_URL = process.env.API_URL;

	if (!AUTH_KEY) {
		throw new Error("AUTH_KEY is not defined in the environment variables.");
	}

	if (!API_URL) {
		throw new Error("API_URL is not defined in the environment variables.");
	}

	try {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-auth-key": AUTH_KEY,
			},
			body: JSON.stringify(formData),
		});

		if (!response.ok) {
			throw new Error(`External request failed with status ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error submitting form:", error);
		throw new Error("Failed to submit the form");
	}
}
