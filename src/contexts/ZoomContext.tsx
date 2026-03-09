import React, { createContext, useContext, useState, useEffect } from 'react';

interface ZoomContextType {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const ZoomContext = createContext<ZoomContextType | undefined>(undefined);

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
const DEFAULT_ZOOM = 1.0;

export const ZoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    const saved = localStorage.getItem('zoomLevel');
    const parsed = saved ? parseFloat(saved) : DEFAULT_ZOOM;
    return isNaN(parsed) ? DEFAULT_ZOOM : Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, parsed));
  });

  useEffect(() => {
    localStorage.setItem('zoomLevel', zoomLevel.toString());
  }, [zoomLevel]);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const resetZoom = () => {
    setZoomLevel(DEFAULT_ZOOM);
  };

  return (
    <ZoomContext.Provider value={{ zoomLevel, zoomIn, zoomOut, resetZoom }}>
      {children}
    </ZoomContext.Provider>
  );
};

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within ZoomProvider');
  }
  return context;
};
