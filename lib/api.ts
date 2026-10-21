const API_URL="/api/backend";
export type Booking={id:number;booking_date:string;booking_time:string;status:string;confirmation_message?:string};
function customerHeaders(leadId:number) {
 const token=typeof window!=="undefined"?localStorage.getItem(`rapidflow-lead-${leadId}`):null;
 return {"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{})};
}
export class ApiError extends Error {constructor(message:string,public errors:Record<string,string>={},public status=0) {super(message);}}
async function request(path:string,options:RequestInit={}) {
 const response=await fetch(`${API_URL}/${path}`,{...options,cache:"no-store"});
 const data=await response.json();
 if(!response.ok) throw new ApiError(data.message || "Unable to complete the request.",data.errors,response.status);
 return data;
}
export async function createLead(data:{business_id:number;customer_name:string;email?:string;phone?:string;zip_code?:string;issue_description?:string}) {
 const result=await request("leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 if(result.access_token) localStorage.setItem(`rapidflow-lead-${result.data.id}`,result.access_token);
 return result;
}
export function sendChatMessage(leadId:number,message:string) {return request("chat",{method:"POST",headers:customerHeaders(leadId),body:JSON.stringify({lead_id:leadId,message})});}
export function getChatHistory(leadId:number) {return request(`chat/${leadId}`,{headers:customerHeaders(leadId)});}
export function startChat(leadId:number) {return request("chat/start",{method:"POST",headers:customerHeaders(leadId),body:JSON.stringify({lead_id:leadId})});}
export function getAvailability(businessId:number) {return request(`availability?business_id=${businessId}`);}
export function createBooking(data:{business_id:number;lead_id:number;availability_slot_id:number;notes?:string}) {return request("bookings",{method:"POST",headers:customerHeaders(data.lead_id),body:JSON.stringify(data)});}
