import { useState, useEffect } from "react";
import { BREAKPOINTS } from "@/app/utils/breakpoints";

export function useResponsiveBreakpoints() {
	const [breakpoint, setBreakpoint] = useState({
		isLg: false,
		isXl: false,
	});

	useEffect(() => {
		const updateBreakpoint = () => {
			const width = window.innerWidth;
			setBreakpoint({
				isLg: width >= BREAKPOINTS.lg,
				isXl: width >= BREAKPOINTS.xl,
			});
		};

		updateBreakpoint();
		window.addEventListener("resize", updateBreakpoint);

		return () => {
			window.removeEventListener("resize", updateBreakpoint);
		};
	}, []);

	return breakpoint;
}
