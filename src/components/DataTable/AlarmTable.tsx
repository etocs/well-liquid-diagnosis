import React from 'react';
import { Table, Tag, Button, Space, Select, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AlarmRecord } from '../../types';
import {
  FAULT_LEVEL_LABELS,
  FAULT_LEVEL_COLORS,
  PROCESS_RESULT_LABELS,
  PLATFORMS,
} from '../../utils/constants';

interface Props {
  data: AlarmRecord[];
  total: number;
  pageNum: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number, size: number) => void;
  onFilter: (platform: string, wellName: string) => void;
  onDetail?: (record: AlarmRecord) => void;
  onProcess?: (record: AlarmRecord) => void;
}

const AlarmTable: React.FC<Props> = ({
  data,
  total,
  pageNum,
  pageSize,
  loading,
  onPageChange,
  onFilter,
  onDetail,
  onProcess,
}) => {
  const [platform, setPlatform] = React.useState('');
  const [wellName, setWellName] = React.useState('');

  const handleSearch = () => {
    onFilter(platform, wellName);
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
      width: 130,
      render: (text: string) => <span style={{ color: '#8c9eb5' }}>{text}</span>,
    },
    {
      title: '井名称',
      dataIndex: 'wellName',
      key: 'wellName',
      width: 160,
      render: (text: string) => <span style={{ color: '#00ffff' }}>{text}</span>,
    },
    {
      title: '泵名',
      dataIndex: 'pumpName',
      key: 'pumpName',
      width: 120,
    },
    {
      title: '故障类型',
      dataIndex: 'faultType',
      key: 'faultType',
      width: 80,
      render: (text: string) => <Tag color="#1890ff">{text}</Tag>,
    },
    {
      title: '故障等级',
      dataIndex: 'faultLevel',
      key: 'faultLevel',
      width: 110,
      render: (level: string) => (
        <Tag color={FAULT_LEVEL_COLORS[level]} style={{ fontSize: 12 }}>
          {FAULT_LEVEL_LABELS[level]}
        </Tag>
      ),
    },
    {
      title: '故障时间',
      dataIndex: 'faultTime',
      key: 'faultTime',
      width: 155,
      render: (text: string) => <span style={{ color: '#8c9eb5', fontSize: 12 }}>{text}</span>,
    },
    {
      title: '处理结果',
      dataIndex: 'processResult',
      key: 'processResult',
      width: 90,
      render: (result: string) => (
        <Tag color={result === 'processed' ? '#52c41a' : '#ff4d4f'}>
          {PROCESS_RESULT_LABELS[result]}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      render: (_: unknown, record: AlarmRecord) => (
        <Space>
          {record.processResult === 'unprocessed' && (
            <Button
              size="small"
              type="primary"
              danger
              onClick={() => onProcess?.(record)}
              style={{ fontSize: 12 }}
            >
              处理
            </Button>
          )}
          <Button
            size="small"
            onClick={() => onDetail?.(record)}
            style={{
              background: '#002244',
              borderColor: '#1890ff',
              color: '#1890ff',
              fontSize: 12,
            }}
          >
            详细
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 筛选器 */}
      <div className="filter-bar">
        <Select
          placeholder="全部平台"
          value={platform || undefined}
          onChange={v => setPlatform(v || '')}
          allowClear
          style={{ width: 150 }}
          options={PLATFORMS.map(p => ({ label: p, value: p }))}
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
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
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
          onChange={onPageChange}
          onShowSizeChange={onPageChange}
          pageSizeOptions={['5', '10', '20']}
        />
      </div>
    </div>
  );
};

export default AlarmTable;
