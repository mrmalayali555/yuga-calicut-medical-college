export interface EventTicketData {
  name: string;
  date: string;
  time?: string;
  venue?: string;
  title?: string;
  description?: string;
  tier?: string;
  price?: string;
  schedule?: string[];
  slug?: string;
  formSlug?: string;
  fieldsCount?: number;
}

export interface Attendee {
  name: string;
  email: string;
}

export type WorldVariant = "minimal" | "craft" | "retro" | "toy";
export type LayoutVariant = "horizontal" | "vertical";

export interface EventTicketProps {
  event: EventTicketData;
  variant?: WorldVariant;
  layout?: LayoutVariant;
  ticketId?: string;
  defaultAttendee?: Attendee;
  onBook?: (attendee: Attendee) => Promise<void>;
  onTear?: (attendee: Attendee | null) => void;
  flipped?: boolean;
  defaultFlipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
  className?: string;
}
