import React, { useEffect, useState } from 'react';
import { Row, Col, Tag, message, Modal, Button, Spin } from 'antd';
import { RobotOutlined, ThunderboltOutlined, ClockCircleOutlined } from '@ant-design/icons';
import AlarmTable from '../components/DataTable/AlarmTable';
import CurrentChart from '../components/Charts/CurrentChart';
import type { AlarmRecord, MonitorDataPoint } from '../types';
import { getAlarmRecords, getMonitorData, processAlarm } from '../services/api';
import { FAULT_LEVEL_LABELS, FAULT_LEVEL_COLORS, PROCESS_RESULT } from '../utils/constants';
import { useAlarmSound } from '../hooks/useAlarmSound';
import { formatDateTime } from '../utils/date';
import { useAlarm } from '../contexts/AlarmContext';
import { isAIDecisionEnabled } from '../utils/settings';

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
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const { refreshAlarmCount } = useAlarm();
  
  // Check if there are any unprocessed alarms to trigger alarm sound
  const hasUnprocessedAlarms = records.some(r => r.processResult === PROCESS_RESULT.UNPROCESSED);
  useAlarmSound(hasUnprocessedAlarms);

  // Check for AI decision modal when page loads and has unprocessed alarms
  useEffect(() => {
    if (isAIDecisionEnabled() && hasUnprocessedAlarms && records.length > 0) {
      // Show AI decision modal only once per day using localStorage
      const lastShown = localStorage.getItem('aiModalLastShown');
      const today = new Date().toDateString();
      
      if (lastShown !== today) {
        setShowAIModal(true);
        localStorage.setItem('aiModalLastShown', today);
      }
    }
  }, [hasUnprocessedAlarms, records.length]);

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
      
      // Refresh alarm count in context
      refreshAlarmCount();
      
      // If the processed record was selected, update it
      if (selectedRecord?.id === record.id) {
        setSelectedRecord({ 
          ...record, 
          processResult: PROCESS_RESULT.PROCESSED, 
          processTime: formatDateTime()
        });
      }
    } catch (error) {
      message.error('处理预警失败，请重试');
      console.error('Failed to process alarm:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI suggestions for alarms
  const generateAISuggestions = async () => {
    setAiLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const unprocessedAlarms = records.filter(r => r.processResult === PROCESS_RESULT.UNPROCESSED);
    const suggestions: string[] = [];
    
    unprocessedAlarms.forEach(alarm => {
      if (alarm.faultLevel) {
        // Liquid level alarms
        if (alarm.faultLevel === 'level1') {
          suggestions.push(`【${alarm.wellName}】积液一级严重，建议立即启动雾化装置进行排液处理，同时调低生产压力20%`);
        } else if (alarm.faultLevel === 'level2') {
          suggestions.push(`【${alarm.wellName}】积液二级预警，建议启动间歇式雾化排液，监控积液变化趋势`);
        } else if (alarm.faultLevel === 'level3') {
          suggestions.push(`【${alarm.wellName}】积液三级轻微，建议加强监控，如继续上升则启动排液措施`);
        }
      } else if (alarm.turbineStatus) {
        // Turbine alarms
        if (alarm.turbineStatus === 'stopped') {
          suggestions.push(`【${alarm.wellName}】涡轮机停止运行，建议立即停产检修，检查电机和传动系统`);
        } else if (alarm.turbineStatus === 'unstable') {
          suggestions.push(`【${alarm.wellName}】涡轮机运行不稳定，建议检查负载情况，必要时调整运行参数`);
        }
      }
    });
    
    setAiSuggestions(suggestions);
    setAiLoading(false);
  };

  // Handle AI decision - execute countermeasures
  const handleAIDecision = async () => {
    setShowAIModal(false);
    setAiLoading(true);
    
    await generateAISuggestions();
    
    // Process all unprocessed alarms
    const unprocessedAlarms = records.filter(r => r.processResult === PROCESS_RESULT.UNPROCESSED);
    
    try {
      // Process all alarms
      await Promise.all(unprocessedAlarms.map(alarm => processAlarm(alarm.id)));
      
      message.success({
        content: (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>AI辅助决策已完成</div>
            <div style={{ fontSize: 12 }}>已处理 {unprocessedAlarms.length} 条预警，并生成应对措施建议</div>
          </div>
        ),
        duration: 5,
      });
      
      // Show suggestions modal
      Modal.info({
        title: (
          <span>
            <RobotOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            AI生成的应对措施
          </span>
        ),
        width: 700,
        content: (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {aiSuggestions.map((suggestion, idx) => (
              <div key={idx} style={{
                padding: '12px',
                marginBottom: 8,
                background: '#f0f2f5',
                borderRadius: 6,
                borderLeft: '3px solid #1890ff',
              }}>
                <ThunderboltOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                {suggestion}
              </div>
            ))}
          </div>
        ),
      });
      
      // Refresh data
      const result = await getAlarmRecords({ zone, wellName, pageNum, pageSize });
      setRecords(result.list);
      setTotal(result.total);
      refreshAlarmCount();
    } catch (error) {
      message.error('AI处理失败，请重试');
      console.error('AI decision failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle "later" option in AI modal
  const handleAILater = () => {
    setShowAIModal(false);
    message.info('您可以随时在系统设置中调整AI辅助决策选项');
  };

  return (
    <div className="page-container">
      {/* AI Decision Modal */}
      <Modal
        open={showAIModal}
        title={
          <span>
            <RobotOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            AI辅助决策系统
          </span>
        }
        onCancel={handleAILater}
        footer={[
          <Button key="later" onClick={handleAILater}>
            <ClockCircleOutlined /> 稍后再说
          </Button>,
          <Button key="agree" type="primary" onClick={handleAIDecision} loading={aiLoading}>
            <ThunderboltOutlined /> 同意执行
          </Button>,
        ]}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}>
            <div style={{ color: '#0050b3', fontWeight: 600, marginBottom: 8 }}>
              🤖 AI辅助决策系统已开启
            </div>
            <div style={{ color: '#096dd9', fontSize: 14 }}>
              检测到 {records.filter(r => r.processResult === PROCESS_RESULT.UNPROCESSED).length} 条未处理的预警信息
            </div>
          </div>
          
          <div style={{ color: '#595959', lineHeight: 1.8 }}>
            <p>AI系统将为您执行以下操作：</p>
            <ul style={{ marginLeft: 20 }}>
              <li>分析所有预警信息的类型和严重程度</li>
              <li>生成针对性的应对措施建议（如启动雾化、调整参数等）</li>
              <li>自动将所有预警标记为"已处理"状态</li>
              <li>记录AI决策日志供后续查看</li>
            </ul>
            <p style={{ marginTop: 12, color: '#8c8c8c', fontSize: 13 }}>
              💡 提示：您可以在系统设置中关闭AI辅助决策功能
            </p>
          </div>
        </div>
      </Modal>

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
                    <div style={{ color: '#8c9eb5', fontSize: 11 }}>故障详情</div>
                    {selectedRecord.faultLevel ? (
                      <Tag color={FAULT_LEVEL_COLORS[selectedRecord.faultLevel]} style={{ fontSize: 12 }}>
                        {FAULT_LEVEL_LABELS[selectedRecord.faultLevel]}
                      </Tag>
                    ) : selectedRecord.turbineStatus ? (
                      <Tag 
                        color={selectedRecord.turbineStatus === 'normal' ? '#52c41a' : selectedRecord.turbineStatus === 'unstable' ? '#faad14' : '#ff4d4f'} 
                        style={{ fontSize: 12 }}
                      >
                        {selectedRecord.turbineStatus === 'normal' ? '正常' : selectedRecord.turbineStatus === 'unstable' ? '不稳定' : '停止'}
                      </Tag>
                    ) : '-'}
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
