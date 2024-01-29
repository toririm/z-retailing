import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const dayjsJP = () => {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	dayjs.tz.setDefault("Asia/Tokyo");
	dayjs.locale(ja);
	return dayjs;
};
