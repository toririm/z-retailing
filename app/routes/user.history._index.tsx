import { redirect } from "@remix-run/react";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

export const loader = () => {
  dayjs.locale(ja);
  const year = dayjs().get("year");
  const month = (dayjs().get("month") + 1).toString().padStart(2, "0");
  return redirect(`/user/history/${year}/${month}`);
};
