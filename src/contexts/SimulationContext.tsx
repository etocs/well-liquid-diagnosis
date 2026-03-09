import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSimulationService } from '../services/simulation';
import type { Well } from '../types';

interface SimulationContextType {
  isSimulationRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  simulatedWells: Well[];
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulatedWells, setSimulatedWells] = useState<Well[]>([]);
  const simulationService = getSimulationService();

  // Subscribe to well updates
  useEffect(() => {
    simulationService.onWellUpdate((wells) => {
      setSimulatedWells(wells);
    });
  }, [simulationService]);

  const startSimulation = useCallback(() => {
    simulationService.start();
    setIsSimulationRunning(true);
  }, [simulationService]);

  const stopSimulation = useCallback(() => {
    simulationService.stop();
    setIsSimulationRunning(false);
  }, [simulationService]);

  const resetSimulation = useCallback(() => {
    simulationService.reset();
    setIsSimulationRunning(false);
  }, [simulationService]);

  // Auto-start simulation on mount
  useEffect(() => {
    startSimulation();
    return () => {
      stopSimulation();
    };
  }, [startSimulation, stopSimulation]);

  return (
    <SimulationContext.Provider
      value={{
        isSimulationRunning,
        startSimulation,
        stopSimulation,
        resetSimulation,
        simulatedWells,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};
