export enum InvestmentType {
  EQUIPMENT = "EQUIPMENT", // Camera gear, rentals, lighting, etc.
  TRAVEL = "TRAVEL", // Transportation, lodging, fuel, etc.
  VENUE = "VENUE", // Studio or location rent
  STAFF_PAYMENT = "STAFF_PAYMENT", // Assistants, models, makeup artists, etc.
  FOOD = "FOOD", // Meals and refreshments during the shoot
  MARKETING = "MARKETING", // Ads, promotions, or portfolio updates
  MISC = "MISC", // Any unclassified expense
  SALARY = "SALARY", // Regular employee/staff salary
  POST_PRODUCTION = "POST_PRODUCTION", // Editing, retouching, printing
  SOFTWARE_LICENSE = "SOFTWARE_LICENSE", // Editing tools, software subscriptions
  CLIENT_GIFT = "CLIENT_GIFT", // Complimentary gifts, prints, or bonuses
  TAX = "TAX", // Tax or service charges
  EQUIPMENT_MAINTENANCE = "EQUIPMENT_MAINTENANCE" // Repairs, servicing of gear
}

export interface InvestmentModel {
  investmentId: string;
  orderId: string;
  userId: string;
  investmentName: string;
  investedAmount: number; // BigDecimal in Java → number in TS (or string if high precision is needed)
  investmentDate: Date;
  investmentDescription?: string;
  investmentType: InvestmentType;
}
