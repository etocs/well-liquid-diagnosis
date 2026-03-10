import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Table, Modal, Form, Input, Select, message, 
  Popconfirm, Space, Tag 
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface Region {
  id: string;
  name: string;
  wellCount: number;
}

interface WellSegmentInfo {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  depth: number;
  description?: string;
}

const BasicInfo: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [wells, setWells] = useState<WellSegmentInfo[]>([]);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [wellModalVisible, setWellModalVisible] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [editingWell, setEditingWell] = useState<WellSegmentInfo | null>(null);
  const [regionForm] = Form.useForm();
  const [wellForm] = Form.useForm();

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedRegions = localStorage.getItem('customRegions');
      const savedWells = localStorage.getItem('customWells');
      
      if (savedRegions) {
        const parsed = JSON.parse(savedRegions);
        setRegions(parsed);
      }
      
      if (savedWells) {
        const parsed = JSON.parse(savedWells);
        setWells(parsed);
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  const saveRegions = (data: Region[]) => {
    localStorage.setItem('customRegions', JSON.stringify(data));
    setRegions(data);
  };

  const saveWells = (data: WellSegmentInfo[]) => {
    localStorage.setItem('customWells', JSON.stringify(data));
    setWells(data);
  };

  // Region operations
  const handleAddRegion = () => {
    setEditingRegion(null);
    regionForm.resetFields();
    setRegionModalVisible(true);
  };

  const handleEditRegion = (region: Region) => {
    setEditingRegion(region);
    regionForm.setFieldsValue(region);
    setRegionModalVisible(true);
  };

  const handleDeleteRegion = (regionId: string) => {
    const wellsInRegion = wells.filter(w => w.regionId === regionId);
    if (wellsInRegion.length > 0) {
      message.warning(`该区域下还有 ${wellsInRegion.length} 个井段，请先删除井段`);
      return;
    }
    
    const newRegions = regions.filter(r => r.id !== regionId);
    saveRegions(newRegions);
    message.success('区域删除成功');
  };

  const handleRegionSubmit = async () => {
    try {
      const values = await regionForm.validateFields();
      
      if (editingRegion) {
        // Edit existing region
        const newRegions = regions.map(r => 
          r.id === editingRegion.id 
            ? { ...r, name: values.name }
            : r
        );
        saveRegions(newRegions);
        
        // Update wells with new region name
        const newWells = wells.map(w =>
          w.regionId === editingRegion.id
            ? { ...w, regionName: values.name }
            : w
        );
        saveWells(newWells);
        
        message.success('区域更新成功');
      } else {
        // Add new region
        const newRegion: Region = {
          id: `R-${Date.now()}`,
          name: values.name,
          wellCount: 0,
        };
        saveRegions([...regions, newRegion]);
        message.success('区域添加成功');
      }
      
      setRegionModalVisible(false);
      regionForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Well operations
  const handleAddWell = () => {
    setEditingWell(null);
    wellForm.resetFields();
    setWellModalVisible(true);
  };

  const handleEditWell = (well: WellSegmentInfo) => {
    setEditingWell(well);
    wellForm.setFieldsValue(well);
    setWellModalVisible(true);
  };

  const handleDeleteWell = (wellId: string) => {
    const newWells = wells.filter(w => w.id !== wellId);
    saveWells(newWells);
    
    // Update region well count
    updateRegionWellCounts(newWells);
    
    message.success('井段删除成功');
  };

  const handleWellSubmit = async () => {
    try {
      const values = await wellForm.validateFields();
      const region = regions.find(r => r.id === values.regionId);
      
      if (!region) {
        message.error('请选择有效的区域');
        return;
      }
      
      if (editingWell) {
        // Edit existing well
        const newWells = wells.map(w => 
          w.id === editingWell.id 
            ? {
                ...w,
                name: values.name,
                regionId: values.regionId,
                regionName: region.name,
                depth: values.depth,
                description: values.description,
              }
            : w
        );
        saveWells(newWells);
        updateRegionWellCounts(newWells);
        message.success('井段更新成功');
      } else {
        // Add new well
        const newWell: WellSegmentInfo = {
          id: `W-${Date.now()}`,
          name: values.name,
          regionId: values.regionId,
          regionName: region.name,
          depth: values.depth,
          description: values.description,
        };
        const newWells = [...wells, newWell];
        saveWells(newWells);
        updateRegionWellCounts(newWells);
        message.success('井段添加成功');
      }
      
      setWellModalVisible(false);
      wellForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const updateRegionWellCounts = (wellsList: WellSegmentInfo[]) => {
    const counts: Record<string, number> = {};
    wellsList.forEach(w => {
      counts[w.regionId] = (counts[w.regionId] || 0) + 1;
    });
    
    const newRegions = regions.map(r => ({
      ...r,
      wellCount: counts[r.id] || 0,
    }));
    
    saveRegions(newRegions);
  };

  // Table columns
  const regionColumns: ColumnsType<Region> = [
    {
      title: '区域ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '区域名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ color: '#00ffff', fontWeight: 600 }}>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '井段数量',
      dataIndex: 'wellCount',
      key: 'wellCount',
      width: 120,
      render: (count) => <Tag color="blue">{count} 个</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditRegion(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该区域？"
            onConfirm={() => handleDeleteRegion(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const wellColumns: ColumnsType<WellSegmentInfo> = [
    {
      title: '井段ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '井段名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ color: '#00ffff', fontWeight: 600 }}>
          <AppstoreOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '所属区域',
      dataIndex: 'regionName',
      key: 'regionName',
      width: 150,
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: '深度 (m)',
      dataIndex: 'depth',
      key: 'depth',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditWell(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该井段？"
            onConfirm={() => handleDeleteWell(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div style={{
        background: 'linear-gradient(135deg, #002244, #003366)',
        border: '1px solid #1d3a5c',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 20,
      }}>
        <h1 style={{ color: '#00ffff', fontSize: 24, fontWeight: 600, margin: 0 }}>
          基础信息管理
        </h1>
        <p style={{ color: '#8c9eb5', fontSize: 14, margin: '8px 0 0 0' }}>
          管理区域和井段信息，支持添加、编辑和删除操作
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Regions */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                区域管理
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRegion}
              >
                添加区域
              </Button>
            }
            className="panel-card"
          >
            <Table
              dataSource={regions}
              columns={regionColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Wells */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <AppstoreOutlined style={{ marginRight: 8 }} />
                井段管理
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddWell}
                disabled={regions.length === 0}
              >
                添加井段
              </Button>
            }
            className="panel-card"
          >
            <Table
              dataSource={wells}
              columns={wellColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Region Modal */}
      <Modal
        title={editingRegion ? '编辑区域' : '添加区域'}
        open={regionModalVisible}
        onOk={handleRegionSubmit}
        onCancel={() => {
          setRegionModalVisible(false);
          regionForm.resetFields();
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={regionForm}
          layout="vertical"
        >
          <Form.Item
            label="区域名称"
            name="name"
            rules={[{ required: true, message: '请输入区域名称' }]}
          >
            <Input placeholder="例如：A区、B区、3号区域" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Well Modal */}
      <Modal
        title={editingWell ? '编辑井段' : '添加井段'}
        open={wellModalVisible}
        onOk={handleWellSubmit}
        onCancel={() => {
          setWellModalVisible(false);
          wellForm.resetFields();
        }}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={wellForm}
          layout="vertical"
        >
          <Form.Item
            label="井段名称"
            name="name"
            rules={[{ required: true, message: '请输入井段名称' }]}
          >
            <Input placeholder="例如：1号井段、A-01井" />
          </Form.Item>
          
          <Form.Item
            label="所属区域"
            name="regionId"
            rules={[{ required: true, message: '请选择所属区域' }]}
          >
            <Select placeholder="选择区域">
              {regions.map(r => (
                <Option key={r.id} value={r.id}>{r.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            label="深度 (m)"
            name="depth"
            rules={[{ required: true, message: '请输入井段深度' }]}
          >
            <Input type="number" placeholder="例如：1500" addonAfter="米" />
          </Form.Item>
          
          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="可选：输入井段描述信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BasicInfo;
