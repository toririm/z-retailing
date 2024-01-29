import { redirect } from "@remix-run/react";
import { dayjsJP } from "~/utils/dayjs";

export const loader = () => {
	const dayjs = dayjsJP();
	const year = dayjs.tz().get("year");
	const month = (dayjs.tz().get("month") + 1).toString().padStart(2, "0");
	return redirect(`/user/history/${year}/${month}`);
};
