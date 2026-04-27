export const PRODUCT_CATEGORIES = [
  "Cement",
  "Steel",
  "Roofing",
  "Tiles",
  "Plumbing",
  "Electrical",
  "Timber",
  "Paint",
  "Hardware",
  "Tools",
] as const;

export const ORDER_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  TICKET_GENERATED: "Ticket Generated",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export const DELIVERY_FEE = {
  STANDARD: 50.0,
  EXPRESS: 100.0,
  FREE_THRESHOLD: 2000.0,
} as const;

export const TICKET_PREFIX = "EGS-";

export const APP_NAME = "Ekuase General Supplies";
export const APP_DESCRIPTION = "The Idle Constructors Aid - Professional Construction Materials & Services Platform";
