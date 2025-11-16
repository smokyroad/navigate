export type CheckpointType =
  | 'entrance'
  | 'customs'
  | 'gate'
  | 'dining'
  | 'shopping'
  | 'lounge'
  | 'restroom'
  | 'luggage';

export interface Checkpoint {
  id: string;
  name: string;
  type: CheckpointType;
  location: string;
  description: string;
  terminal: string;
  x: number;
  y: number;
  isMandatory?: boolean;
  estimatedDuration?: number; // in minutes
}

export interface TimelineCheckpoint extends Checkpoint {
  arrivalTime: Date;
  departureTime: Date;
  travelTimeToNext?: number; // in minutes
}

export interface ItineraryState {
  checkpointIds: string[];
  currentStep: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  suggestions?: Checkpoint[];
  isConfirmation?: boolean;
}
