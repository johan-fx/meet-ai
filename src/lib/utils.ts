import { type ClassValue, clsx } from "clsx";
import humanizeDuration from "humanize-duration";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number, language: string = "en") {
	return humanizeDuration(seconds * 1000, {
		language,
		units: ["h", "m", "s"],
		round: true,
		largest: 1,
	});
}
