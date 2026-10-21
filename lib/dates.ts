export const BUSINESS_TIME_ZONE="America/Chicago";
export function displayDate(value: string) {
 return new Date(`${value.slice(0,10)}T12:00:00Z`).toLocaleDateString("en-US",{timeZone:"UTC",weekday:"short",month:"short",day:"numeric",year:"numeric"});
}
export function displayTime(value: string) {
 if(/am|pm/i.test(value)) return value;
 const [hour,minute]=value.split(":");
 return `${Number(hour)%12 || 12}:${minute || "00"} ${Number(hour)>=12?"PM":"AM"}`;
}
export function businessToday() {return new Intl.DateTimeFormat("en-CA",{timeZone:BUSINESS_TIME_ZONE,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());}
