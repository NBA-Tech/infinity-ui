export const BUSINESSTYPE = [
  "Consulting",
  "Information Technology",
  "Marketing & Advertising",
  "Legal Services",
  "Healthcare Services",
  "Education & Training",
  "Travel & Tourism",
  "Real Estate",
  "Logistics & Transportation",
  "Event Management",
  "Financial Services",
  "Human Resources / Staffing",
  "E-commerce",
  "Grocery Store",
  "Clothing & Apparel",
  "Electronics Store",
  "Pharmacy / Medical Store",
  "Furniture & Home Decor",
  "Jewelry & Accessories",
  "Sports & Fitness Equipment",
  "Automobile Manufacturing",
  "Food & Beverage Processing",
  "Textiles & Garments",
  "Electronics & Appliances",
  "Pharmaceuticals",
  "Construction Materials",
  "Chemicals & Plastics",
  "Machinery & Tools",
  "Restaurant",
  "Cafe / Bakery",
  "Hotel / Resort",
  "Catering Services",
  "Food Delivery / Cloud Kitchen",
  "Bars & Breweries",
  "Farming",
  "Dairy & Poultry",
  "Fisheries",
  "Agro Products / Seeds",
  "Agro Equipment Supply",
  "Media & Entertainment",
  "Film & Production",
  "Publishing & Printing",
  "Graphic Design",
  "Photography & Videography",
  "Handicrafts & Artisans",
  "Charity Organization",
  "NGO / Social Services",
  "Religious Organization",
  "Educational Institution",
  "Government Contractor",
  "Freelancer / Independent Professional",
  "Startup / Small Business",
  "Import / Export",
  "Wholesale Trade",
  "Other"
];
export const WORKSTATUS = ["Pending", "Approved", "Rejected", "Cancelled"];

export const QUOTATION_FIELDS = [
  // Company Information
  { label: "Company Title", value: "companyTitle", type: "text" },
  { label: "Company Logo", value: "companyLogo", type: "file" },
  { label: "Company Description", value: "companyDescription", type: "text" },
  { label: "Company Info (address,email,website,phone)", value: "companyInfo", type: "text" },

  // Client Information
  { label: "Client Info(name,email,phone,address)", value: "clientInfo", type: "text" },

  // Quotation Details
  { label: "Quotation Number", value: "quotationNumber", type: "text" },
  { label: "Quotation Date", value: "quotationDate", type: "date" },
  { label: "Valid Until", value: "validUntil", type: "date" },

  // Services Table (line items)
  { label: "Service Info(serviceId,name,description,cost)", value: "serviceInfo", type: "text" },

  // Additional Notes
  { label: "Terms & Conditions", value: "terms", type: "text" },
  { label: "Special Notes", value: "notes", type: "text" },

  // Signature
  { label: "Digital Signature", value: "digitalSignature", type: "file" },
];
