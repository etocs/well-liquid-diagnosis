// This chart component is no longer used — kept for backwards compatibility.
import React from 'react';
import type { MonitorDataPoint } from '../../types';

interface Props {
  data: MonitorDataPoint[];
  height?: number;
}

const VoltageFreqChart: React.FC<Props> = ({ height = 220 }) => (
  <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8c9eb5' }}>
    —
  </div>
);

export default VoltageFreqChart;
