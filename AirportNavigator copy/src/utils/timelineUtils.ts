import { Checkpoint, TimelineCheckpoint } from '../types';

/**
 * Calculate walking time between two checkpoints based on their coordinates
 * Assuming average walking speed and airport layout
 */
export function calculateTravelTime(from: Checkpoint, to: Checkpoint): number {
  // Calculate Euclidean distance
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Convert distance to minutes (assuming each unit is ~50 meters and walking speed of 80m/min)
  // Add a minimum of 3 minutes between any two points
  const travelTime = Math.max(3, Math.round((distance * 50) / 80));
  
  return travelTime;
}

/**
 * Generate timeline with arrival and departure times for each checkpoint
 * @param checkpoints - Array of checkpoints in order
 * @param startTime - Starting time (defaults to current time)
 */
export function generateTimeline(
  checkpoints: Checkpoint[],
  startTime: Date = new Date()
): TimelineCheckpoint[] {
  if (checkpoints.length === 0) return [];

  const timeline: TimelineCheckpoint[] = [];
  let currentTime = new Date(startTime);

  checkpoints.forEach((checkpoint, index) => {
    // Calculate travel time from previous checkpoint
    let travelTime = 0;
    if (index > 0) {
      travelTime = calculateTravelTime(checkpoints[index - 1], checkpoint);
      // Add travel time to current time
      currentTime = new Date(currentTime.getTime() + travelTime * 60000);
    }

    const arrivalTime = new Date(currentTime);
    const duration = checkpoint.estimatedDuration || 10; // Default 10 minutes
    const departureTime = new Date(currentTime.getTime() + duration * 60000);

    timeline.push({
      ...checkpoint,
      arrivalTime,
      departureTime,
      travelTimeToNext: index < checkpoints.length - 1 
        ? calculateTravelTime(checkpoint, checkpoints[index + 1])
        : undefined,
    });

    // Update current time to departure time
    currentTime = departureTime;
  });

  return timeline;
}

/**
 * Calculate total journey time in minutes
 */
export function calculateTotalTime(timeline: TimelineCheckpoint[]): number {
  if (timeline.length === 0) return 0;
  
  const start = timeline[0].arrivalTime.getTime();
  const end = timeline[timeline.length - 1].departureTime.getTime();
  
  return Math.round((end - start) / 60000);
}

/**
 * Format time for display (HH:MM)
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
