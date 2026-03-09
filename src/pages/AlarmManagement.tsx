import React, { useEffect, useState } from 'react';
import { Row, Col, Tag, message } from 'antd';
import AlarmTable from '../components/DataTable/AlarmTable';
import CurrentChart from '../components/Charts/CurrentChart';
import type { AlarmRecord, MonitorDataPoint } from '../types';
import { getAlarmRecords, getMonitorData, processAlarm } from '../services/api';
import { FAULT_LEVEL_LABELS, FAULT_LEVEL_COLORS } from '../utils/constants';
import { useAlarmSound } from '../hooks/useAlarmSound';

const AlarmManagement: React.FC = () => {
  const [records, setRecords] = useState<AlarmRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState('');
  const [wellName, setWellName] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AlarmRecord | null>(null);
  const [monitorData, setMonitorData] = useState<MonitorDataPoint[]>([]);
  
  // Check if there are any unprocessed alarms to trigger alarm sound
  const hasUnprocessedAlarms = records.some(r => r.processResult === 'unprocessed');
  useAlarmSound(hasUnprocessedAlarms);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getAlarmRecords({ zone, wellName, pageNum, pageSize });
      setRecords(result.list);
      setTotal(result.total);
      setLoading(false);
    };
    fetchData();
  }, [pageNum, pageSize, zone, wellName]);

  const handleFilter = (z: string, w: string) => {
    setZone(z);
    setWellName(w);
    setPageNum(1);
  };

  const handleDetail = async (record: AlarmRecord) => {
    setSelectedRecord(record);
    const data = await getMonitorData(record.wellId);
    setMonitorData(data);
  };

  const handleProcess = async (record: AlarmRecord) => {
    try {
      setLoading(true);
      await processAlarm(record.id);
      message.success(`已处理预警: ${record.wellName} - ${record.faultType}`);
      
      // Refresh the alarm list to reflect the updated status
      const result = await getAlarmRecords({ zone, wellName, pageNum, pageSize });
      setRecords(result.list);
      setTotal(result.total);
      
      // If the processed record was selected, update it
      if (selectedRecord?.id === record.id) {
        setSelectedRecord({ ...record, processResult: 'processed', processTime: new Date().toISOString().slice(0, 19).replace('T', ' ') });
      }
    } catch (error) {
      message.error('处理预警失败，请重试');
      console.error('Failed to process alarm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Row gutter={16}>
        {/* 左侧：预警表格 */}
        <Col xs={24} xl={selectedRecord ? 12 : 24}>
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <div className="panel-title">井管故障预警</div>
            <AlarmTable
              data={records}
              total={total}
              pageNum={pageNum}
              pageSize={pageSize}
              loading={loading}
              onPageChange={(page, size) => { setPageNum(page); setPageSize(size); }}
              onFilter={handleFilter}
              onDetail={handleDetail}
              onProcess={handleProcess}
            />
          </div>
        </Col>

        {/* 右侧：诊断曲线 */}
        {selectedRecord && (
          <Col xs={24} xl={12}>
            <div className="panel-card" style={{ marginBottom: 0 }}>
              <div className="panel-title">
                {selectedRecord.wellName} 故障诊断曲线
              </div>

              {/* 涡轮机电流图 */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: '#8c9eb5', fontSize: 12, marginBottom: 4 }}>涡轮机电流 (A)</div>
                <CurrentChart data={monitorData} height={220} />
              </div>

              {/* 故障信息 */}
              <div style={{
                background: '#001529',
                border: '1px solid #1d3a5c',
                borderRadius: 6,
                padding: 12,
              }}>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <div style={{ color: '#8c9eb5', fontSize: 11 }}>故障名称</div>
                    <div style={{ color: '#ff4d4f', fontSize: 13, fontWeight: 600 }}>
                      {selectedRecord.faultType}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ color: '#8c9eb5', fontSize: 11 }}>故障等级</div>
                    <Tag color={FAULT_LEVEL_COLORS[selectedRecord.faultLevel]} style={{ fontSize: 12 }}>
                      {FAULT_LEVEL_LABELS[selectedRecord.faultLevel]}
                    </Tag>
                  </Col>
                  <Col span={24}>
                    <div style={{ color: '#8c9eb5', fontSize: 11 }}>故障区间</div>
                    <div style={{ color: '#faad14', fontSize: 12 }}>
                      {selectedRecord.faultRange || selectedRecord.faultTime}
                    </div>
                  </Col>
                  <Col span={24}>
                    <div style={{ color: '#8c9eb5', fontSize: 11 }}>故障原因</div>
                    <div style={{ color: '#c8d8e8', fontSize: 12, lineHeight: 1.6 }}>
                      {selectedRecord.faultReason}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default AlarmManagement;
