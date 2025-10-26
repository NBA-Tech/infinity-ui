import { TextStyle, ViewStyle } from "react-native";

export type EventPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface EventModel {
  eventId: string;          // maps from @Id
  userId: string;
  createdDate?: Date;      // Date in ISO string (e.g., "2025-10-05T00:00:00.000Z")
  eventTitle: string;
  eventDescription: string;
  eventDateString: string;        // stored as string in your Java model
  eventPriority: EventPriority;
  eventDate:Date;
}

type PriorityStyles = {
  container: ViewStyle;
  text: TextStyle;
};

export const PRIORITY_STYLES: Record<EventPriority, PriorityStyles> = {
  LOW: {
    container: { backgroundColor: "#C8E6C9", borderRadius: 8 },  // light green
    text: { color: "#1B5E20", fontWeight: "bold" },
  },
  MEDIUM: {
    container: { backgroundColor: "#FFF9C4", borderRadius: 8 },  // light yellow
    text: { color: "#F57F17", fontWeight: "bold" },
  },
  HIGH: {
    container: { backgroundColor: "#FFE0B2", borderRadius: 8 },  // light orange
    text: { color: "#E65100", fontWeight: "bold" },
  },
  URGENT: {
    container: { backgroundColor: "#FFCDD2", borderRadius: 8 },  // light red
    text: { color: "#B71C1C", fontWeight: "bold" },
  },
};