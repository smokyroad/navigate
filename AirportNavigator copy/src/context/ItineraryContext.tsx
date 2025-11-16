import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CHECKPOINTS } from '../data/checkpoints';
import { Checkpoint, TimelineCheckpoint } from '../types';
import { generateTimeline } from '../utils/timelineUtils';
import { optimizeCheckpointOrder } from '../utils/routeOptimization';

interface ItineraryContextValue {
  checkpoints: Checkpoint[];
  selectedCheckpoints: string[];
  timeline: TimelineCheckpoint[];
  currentStep: number;
  startTime: Date;
  setStartTime: (time: Date) => void;
  toggleCheckpoint: (checkpointId: string) => void;
  addCheckpoint: (checkpointId: string) => void;
  addMultipleCheckpoints: (checkpointIds: string[]) => void;
  removeCheckpoint: (checkpointId: string) => void;
  setCurrentStep: (step: number) => void;
  resetItinerary: () => void;
}

const ItineraryContext = createContext<ItineraryContextValue | undefined>(undefined);

export function ItineraryProvider({ children }: PropsWithChildren) {
  const { entranceId, customsId, gateId, mandatoryIds } = useMemo(() => {
    const mandatory = CHECKPOINTS.filter((cp) => cp.isMandatory);
    const entrance = mandatory.find((cp) => cp.type === 'entrance');
    const customs = mandatory.find((cp) => cp.type === 'customs');
    const gate = mandatory.find((cp) => cp.type === 'gate');
    
    return {
      entranceId: entrance?.id,
      customsId: customs?.id,
      gateId: gate?.id,
      mandatoryIds: mandatory.map((cp) => cp.id),
    };
  }, []);

  // Initialize with mandatory checkpoints, Entrance first, Gate last
  const initialCheckpoints = useMemo(() => {
    const result: string[] = [];
    if (entranceId) result.push(entranceId);
    if (customsId) result.push(customsId);
    if (gateId) result.push(gateId);
    return result;
  }, [entranceId, customsId, gateId]);

  const [selectedCheckpoints, setSelectedCheckpoints] = useState<string[]>(() =>
    optimizeCheckpointOrder(initialCheckpoints, CHECKPOINTS, {
      startId: entranceId,
      endId: gateId,
    })
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [startTime, setStartTime] = useState<Date>(new Date());

  const optimizeOrder = useCallback(
    (ids: string[]) =>
      optimizeCheckpointOrder(ids, CHECKPOINTS, {
        startId: entranceId,
        endId: gateId,
      }),
    [entranceId, gateId]
  );

  // Generate timeline based on selected checkpoints
  const timeline = useMemo(() => {
    const orderedCheckpoints = selectedCheckpoints
      .map((id) => CHECKPOINTS.find((cp) => cp.id === id))
      .filter((cp): cp is Checkpoint => cp !== undefined);
    return generateTimeline(orderedCheckpoints, startTime);
  }, [selectedCheckpoints, startTime]);

  useEffect(() => {
    setCurrentStep((prev: number) => Math.min(prev, selectedCheckpoints.length || 1));
  }, [selectedCheckpoints]);

  const toggleCheckpoint = (checkpointId: string) => {
    if (mandatoryIds.includes(checkpointId)) return;

    setSelectedCheckpoints((prev: string[]) => {
      if (prev.includes(checkpointId)) {
        // Remove the checkpoint
        const next = prev.filter((id: string) => id !== checkpointId);
        return optimizeOrder(next);
      } else {
        // Add the checkpoint and re-optimize order
        return optimizeOrder([...prev, checkpointId]);
      }
    });
  };

  const addCheckpoint = (checkpointId: string) => {
    setSelectedCheckpoints((prev: string[]) => {
      if (prev.includes(checkpointId)) {
        return prev;
      }

      return optimizeOrder([...prev, checkpointId]);
    });
  };

  const addMultipleCheckpoints = (checkpointIds: string[]) => {
    setSelectedCheckpoints((prev) => {
      const existingIds = new Set(prev);
      const newIds = checkpointIds.filter((id) => !existingIds.has(id));
      if (newIds.length === 0) {
        return prev;
      }
      return optimizeOrder([...prev, ...newIds]);
    });
  };

  const removeCheckpoint = (checkpointId: string) => {
    if (mandatoryIds.includes(checkpointId)) return;
    setSelectedCheckpoints((prev: string[]) => {
      const next = prev.filter((id: string) => id !== checkpointId);
      return optimizeOrder(next);
    });
  };

  const resetItinerary = () => {
    setSelectedCheckpoints(
      optimizeCheckpointOrder(initialCheckpoints, CHECKPOINTS, {
        startId: entranceId,
        endId: gateId,
      })
    );
    setCurrentStep(1);
  };

  const value: ItineraryContextValue = {
    checkpoints: CHECKPOINTS,
    selectedCheckpoints,
    timeline,
    currentStep,
    startTime,
    setStartTime,
    toggleCheckpoint,
    addCheckpoint,
    addMultipleCheckpoints,
    removeCheckpoint,
    setCurrentStep: (step: number) => {
      const total = selectedCheckpoints.length || 1;
      const nextStep = Math.min(Math.max(step, 1), total);
      setCurrentStep(nextStep);
    },
    resetItinerary,
  };

  return <ItineraryContext.Provider value={value}>{children}</ItineraryContext.Provider>;
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used inside ItineraryProvider');
  }
  return context;
}
