import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, DatePicker, Input, Button, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AlarmRecord } from '../types';
import { getAlarmRecords } from '../services/api';
import { FAULT_LEVEL_LABELS, FAULT_LEVEL_COLORS, PROCESS_RESULT_LABELS, PLATFORMS } from '../utils/constants';

const { RangePicker } = DatePicker;

const AlarmHistory: React.FC = () => {
  const [records, setRecords] = useState<AlarmRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('');
  const [wellName, setWellName] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const result = await getAlarmRecords({
      platform,
      wellName,
      startTime: dateRange?.[0],
      endTime: dateRange?.[1],
      pageNum,
      pageSize,
    });
    setRecords(result.list);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pageNum, pageSize]);

  const handleSearch = () => {
    setPageNum(1);
    fetchData();
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_: unknown, __: AlarmRecord, index: number) => (pageNum - 1) * pageSize + index + 1,
    },
    {
      title: '隶属平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (text: string) => <span style={{ color: '#8c9eb5' }}>{text}</span>,
    },
    {
      title: '井名称',
      dataIndex: 'wellName',
      key: 'wellName',
      render: (text: string) => <span style={{ color: '#00ffff' }}>{text}</span>,
    },
    {
      title: '泵名',
      dataIndex: 'pumpName',
      key: 'pumpName',
    },
    {
      title: '故障类型',
      dataIndex: 'faultType',
      key: 'faultType',
      render: (text: string) => <Tag color="#1890ff">{text}</Tag>,
    },
    {
      title: '故障等级',
      dataIndex: 'faultLevel',
      key: 'faultLevel',
      render: (level: string) => (
        <Tag color={FAULT_LEVEL_COLORS[level]}>{FAULT_LEVEL_LABELS[level]}</Tag>
      ),
    },
    {
      title: '故障时间',
      dataIndex: 'faultTime',
      key: 'faultTime',
      render: (text: string) => <span style={{ color: '#8c9eb5', fontSize: 12 }}>{text}</span>,
    },
    {
      title: '处理结果',
      dataIndex: 'processResult',
      key: 'processResult',
      render: (result: string) => (
        <Tag color={result === 'processed' ? '#52c41a' : '#ff4d4f'}>
          {PROCESS_RESULT_LABELS[result]}
        </Tag>
      ),
    },
    {
      title: '处理时间',
      dataIndex: 'processTime',
      key: 'processTime',
      render: (text?: string) => (
        <span style={{ color: '#8c9eb5', fontSize: 12 }}>{text || '-'}</span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="panel-card">
        <div className="panel-title">历史预警记录</div>

        {/* 筛选器 */}
        <div className="filter-bar">
          <Select
            placeholder="选择平台"
            value={platform || undefined}
            onChange={v => setPlatform(v || '')}
            allowClear
            style={{ width: 150 }}
            options={PLATFORMS.map(p => ({ label: p, value: p }))}
          />
          <RangePicker
            onChange={(_, dateStrings) => {
              if (dateStrings[0] && dateStrings[1]) {
                setDateRange([dateStrings[0], dateStrings[1]]);
              } else {
                setDateRange(null);
              }
            }}
            placeholder={['起始时间', '截止时间']}
            style={{ width: 280 }}
          />
          <Input
            placeholder="输入井名搜索"
            value={wellName}
            onChange={e => setWellName(e.target.value)}
            style={{ width: 180 }}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined style={{ color: '#8c9eb5' }} />}
          />
          <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
            查询
          </Button>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1100 }}
          size="small"
        />

        {/* 分页 */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#8c9eb5', fontSize: 13 }}>共 {total} 条记录</span>
          <Pagination
            current={pageNum}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showQuickJumper
            onChange={(page, size) => { setPageNum(page); setPageSize(size); }}
            onShowSizeChange={(page, size) => { setPageNum(page); setPageSize(size); }}
            pageSizeOptions={['10', '20', '50']}
          />
        </div>
      </div>
    </div>
  );
};

export default AlarmHistory;
