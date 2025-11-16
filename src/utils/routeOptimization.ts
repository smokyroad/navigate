import { Checkpoint } from '../types';
import { calculateTravelTime } from './timelineUtils';

interface OptimizeOptions {
  startId?: string;
  endId?: string;
}

/**
 * Returns an optimized ordering of checkpoint ids using a greedy nearest-neighbor walk.
 * Start and end checkpoints can be pinned via options to ensure the route begins/ends with mandatory stops.
 */
export function optimizeCheckpointOrder(
  checkpointIds: string[],
  allCheckpoints: Checkpoint[],
  options: OptimizeOptions = {}
): string[] {
  if (checkpointIds.length <= 1) {
    return checkpointIds;
  }

  const checkpointMap = new Map(allCheckpoints.map((checkpoint) => [checkpoint.id, checkpoint]));
  const uniqueIds: string[] = [];
  const seen = new Set<string>();

  checkpointIds.forEach((id) => {
    if (checkpointMap.has(id) && !seen.has(id)) {
      uniqueIds.push(id);
      seen.add(id);
    }
  });

  if (uniqueIds.length <= 1) {
    return uniqueIds;
  }

  const { startId, endId } = options;
  const hasStart = !!startId && uniqueIds.includes(startId);
  const hasEnd = !!endId && uniqueIds.includes(endId) && startId !== endId;

  const middleIds = uniqueIds.filter(
    (id) => (!hasStart || id !== startId) && (!hasEnd || id !== endId)
  );

  const ordered: string[] = [];
  let currentId: string;

  if (hasStart) {
    ordered.push(startId!);
    currentId = startId!;
  } else {
    const first = middleIds.shift();
    if (!first) {
      return hasEnd ? [endId!] : uniqueIds;
    }
    ordered.push(first);
    currentId = first;
  }

  const remaining = new Set(middleIds);

  while (remaining.size > 0) {
    let bestId: string | null = null;
    let bestCost = Number.POSITIVE_INFINITY;

    for (const candidate of remaining) {
      const currentCheckpoint = checkpointMap.get(currentId);
      const candidateCheckpoint = checkpointMap.get(candidate);
      if (!currentCheckpoint || !candidateCheckpoint) continue;

      const cost = calculateTravelTime(currentCheckpoint, candidateCheckpoint);
      if (cost < bestCost) {
        bestCost = cost;
        bestId = candidate;
      }
    }

    if (!bestId) {
      break;
    }

    ordered.push(bestId);
    remaining.delete(bestId);
    currentId = bestId;
  }

  if (hasEnd) {
    ordered.push(endId!);
  }

  return ordered;
}
