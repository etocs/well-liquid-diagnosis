import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Table, Modal, Form, Input, Select, message, 
  Popconfirm, Space, Tag, Statistic 
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Well } from '../types';
import { getSimulationService } from '../services/simulation';

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
  isSimulated?: boolean; // Flag to indicate if this is from simulation data
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
  const simulationService = getSimulationService();

  // Load data from localStorage and merge with simulation data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Get simulation wells
      const simWells: Well[] = simulationService.getWells();
      
      // Convert simulation wells to WellSegmentInfo format
      const simulatedWellSegments: WellSegmentInfo[] = simWells.map(well => ({
        id: well.id,
        name: well.name,
        regionId: well.zone,
        regionName: well.zone,
        depth: well.segments[well.segments.length - 1]?.depth || 1500,
        description: `模拟数据 - ${well.segments.length}个井段`,
        isSimulated: true,
      }));
      
      // Get custom regions and wells from localStorage
      const savedRegions = localStorage.getItem('customRegions');
      const savedWells = localStorage.getItem('customWells');
      
      let customRegions: Region[] = [];
      let customWells: WellSegmentInfo[] = [];
      
      if (savedRegions) {
        customRegions = JSON.parse(savedRegions);
      }
      
      if (savedWells) {
        customWells = JSON.parse(savedWells);
      }
      
      // Extract unique regions from simulation data
      const simRegionNames = Array.from(new Set(simWells.map(w => w.zone)));
      const simRegions: Region[] = simRegionNames.map(name => ({
        id: name,
        name: name,
        wellCount: simulatedWellSegments.filter(w => w.regionName === name).length,
      }));
      
      // Merge regions (custom + simulation)
      const allRegions = [...simRegions];
      customRegions.forEach(cr => {
        if (!allRegions.find(r => r.id === cr.id)) {
          allRegions.push(cr);
        }
      });
      
      // Update well counts
      const allWells = [...simulatedWellSegments, ...customWells];
      allRegions.forEach(region => {
        region.wellCount = allWells.filter(w => w.regionId === region.id).length;
      });
      
      setRegions(allRegions);
      setWells(allWells);
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  const saveRegions = (data: Region[]) => {
    localStorage.setItem('customRegions', JSON.stringify(data));
    setRegions(data);
  };

  const saveWells = (data: WellSegmentInfo[]) => {
    // Only save custom wells (not simulated ones)
    const customWells = data.filter(w => !w.isSimulated);
    localStorage.setItem('customWells', JSON.stringify(customWells));
    
    // Update state with all wells
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
    const well = wells.find(w => w.id === wellId);
    if (!well) return;
    
    // If it's a simulated well, mark it as deleted
    if (well.isSimulated) {
      const deletedWells = localStorage.getItem('deletedSimulatedWells');
      const deleted: string[] = deletedWells ? JSON.parse(deletedWells) : [];
      deleted.push(wellId);
      localStorage.setItem('deletedSimulatedWells', JSON.stringify(deleted));
      
      // Remove from simulation service
      simulationService.removeWell(wellId);
      
      message.success(`已删除井段: ${well.name}，将不再显示和生成报警`);
    } else {
      message.success('自定义井段删除成功');
    }
    
    const newWells = wells.filter(w => w.id !== wellId);
    saveWells(newWells);
    
    // Update region well count
    updateRegionWellCounts(newWells);
    
    // Reload data to reflect changes
    loadData();
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
        const newWellId = `W-${Date.now()}`;
        // Auto-generate well name: Region + Well Name
        const fullWellName = `${region.name}-${values.name}`;
        
        const newWell: WellSegmentInfo = {
          id: newWellId,
          name: fullWellName,
          regionId: values.regionId,
          regionName: region.name,
          depth: values.depth,
          description: values.description,
          isSimulated: false, // Custom well
        };
        
        // Add to simulation service
        simulationService.addWell({
          id: newWellId,
          name: fullWellName,
          zone: region.name,
          depth: values.depth,
        });
        
        const newWells = [...wells, newWell];
        saveWells(newWells);
        updateRegionWellCounts(newWells);
        message.success(`井段添加成功: ${fullWellName}，已在数据大屏显示`);
      }
      
      setWellModalVisible(false);
      wellForm.resetFields();
      
      // Reload data to reflect changes
      loadData();
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
      width: 100,
      render: (text: string) => (
        <span style={{ color: '#8c9eb5', fontSize: 12, fontFamily: 'monospace' }}>
          {text}
        </span>
      ),
    },
    {
      title: '井段名称',
      key: 'name',
      render: (_: unknown, record: WellSegmentInfo) => (
        <Space>
          <AppstoreOutlined style={{ color: '#1890ff' }} />
          <span style={{ color: '#00ffff', fontWeight: 600 }}>
            {record.name}
          </span>
          {record.isSimulated && (
            <Tag color="orange" icon={<ExperimentOutlined />} style={{ fontSize: 11 }}>
              模拟
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '所属区域',
      dataIndex: 'regionName',
      key: 'regionName',
      width: 120,
      render: (text: string) => (
        <Tag color="cyan" style={{ fontSize: 12 }}>
          <EnvironmentOutlined style={{ marginRight: 4 }} />
          {text}
        </Tag>
      ),
    },
    {
      title: '深度 (m)',
      dataIndex: 'depth',
      key: 'depth',
      width: 100,
      render: (depth: number) => (
        <span style={{ color: '#52c41a', fontWeight: 600 }}>
          {depth}
        </span>
      ),
    },
    {
      title: '描述',
      key: 'description',
      ellipsis: true,
      render: (_: unknown, record: WellSegmentInfo) => (
        <span style={{ color: '#8c9eb5', fontSize: 12 }}>
          {record.description || '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          {!record.isSimulated && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditWell(record)}
              size="small"
              style={{ color: '#1890ff' }}
            >
              编辑
            </Button>
          )}
          <Popconfirm
            title={record.isSimulated ? "删除后将不再显示此井段和生成报警，确认删除？" : "确认删除该井段？"}
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
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #002244, #003366)',
        border: '1px solid #1d3a5c',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 20,
        boxShadow: '0 4px 12px rgba(0, 255, 255, 0.1)',
      }}>
        <h1 style={{ 
          color: '#00ffff', 
          fontSize: 24, 
          fontWeight: 600, 
          margin: 0,
          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
        }}>
          <DatabaseOutlined style={{ marginRight: 12 }} />
          基础信息管理
        </h1>
        <p style={{ color: '#8c9eb5', fontSize: 14, margin: '8px 0 0 0' }}>
          管理区域和井段信息，支持添加、编辑和删除操作
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #001529, #002a4a)',
              border: '1px solid #1d3a5c',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0, 255, 255, 0.1)',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#8c9eb5', fontSize: 13 }}>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  区域总数
                </span>
              }
              value={regions.length}
              valueStyle={{ color: '#00ffff', fontWeight: 700, fontSize: 32 }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #001529, #002a4a)',
              border: '1px solid #1d3a5c',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0, 255, 255, 0.1)',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#8c9eb5', fontSize: 13 }}>
                  <AppstoreOutlined style={{ marginRight: 6 }} />
                  井段总数
                </span>
              }
              value={wells.length}
              valueStyle={{ color: '#52c41a', fontWeight: 700, fontSize: 32 }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #001529, #002a4a)',
              border: '1px solid #1d3a5c',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0, 255, 255, 0.1)',
            }}
          >
            <Statistic
              title={
                <span style={{ color: '#8c9eb5', fontSize: 13 }}>
                  <ExperimentOutlined style={{ marginRight: 6 }} />
                  模拟井段
                </span>
              }
              value={wells.filter(w => w.isSimulated).length}
              valueStyle={{ color: '#faad14', fontWeight: 700, fontSize: 32 }}
              suffix="个"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Regions */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ color: '#00ffff', fontSize: 15, fontWeight: 600 }}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                区域管理
              </span>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRegion}
                style={{
                  background: 'linear-gradient(135deg, #1890ff, #096dd9)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                }}
              >
                添加区域
              </Button>
            }
            style={{
              background: '#001529',
              border: '1px solid #1d3a5c',
              borderRadius: 8,
            }}
            headStyle={{
              borderBottom: '1px solid #1d3a5c',
              background: '#002244',
            }}
          >
            <Table
              dataSource={regions}
              columns={regionColumns}
              rowKey="id"
              pagination={false}
              size="small"
              style={{
                background: 'transparent',
              }}
            />
          </Card>
        </Col>

        {/* Wells */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ color: '#00ffff', fontSize: 15, fontWeight: 600 }}>
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
                style={{
                  background: regions.length === 0 ? undefined : 'linear-gradient(135deg, #52c41a, #389e0d)',
                  border: 'none',
                  boxShadow: regions.length === 0 ? undefined : '0 2px 8px rgba(82, 196, 26, 0.3)',
                }}
              >
                添加井段
              </Button>
            }
            style={{
              background: '#001529',
              border: '1px solid #1d3a5c',
              borderRadius: 8,
            }}
            headStyle={{
              borderBottom: '1px solid #1d3a5c',
              background: '#002244',
            }}
          >
            <Table
              dataSource={wells}
              columns={wellColumns}
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: false,
                style: { marginBottom: 0 }
              }}
              size="small"
              style={{
                background: 'transparent',
              }}
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
            extra="提示：最终名称将为 [区域]-[井段名称]，例如：A区-1号井段"
          >
            <Input placeholder="例如：1号井段、2号井管" />
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
