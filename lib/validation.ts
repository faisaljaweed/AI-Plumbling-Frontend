export function validateEnquiry(data:{customer_name:string;email:string;phone:string;zip_code:string;issue_description:string}) {
 const errors:Record<string,string>={};
 if(!/\p{L}/u.test(data.customer_name) || data.customer_name.trim().length<2 || data.customer_name.length>100)errors.customer_name="Enter a name between 2 and 100 characters.";
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email) || data.email.length>254)errors.email="Enter a valid email address.";
 if(!/^[+()\d\s.-]+$/.test(data.phone) || !/\d/.test(data.phone) || data.phone.length>25)errors.phone="Enter a phone number.";
 if(!/^\d{5}(-\d{4})?$/.test(data.zip_code))errors.zip_code="Enter a valid ZIP code.";
 if(data.issue_description.trim().length<10 || data.issue_description.length>2000)errors.issue_description="Describe the issue in 10–2,000 characters.";
 return errors;
}
