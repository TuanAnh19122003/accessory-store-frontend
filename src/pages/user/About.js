import React from 'react';
import { Row, Col, Typography, Card, Button, Tag } from 'antd';
import {
    ToolOutlined,
    SafetyOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const About = () => {
    return (
        <div style={{ background: '#fff8f5', padding: '60px 20px' }}>
            {/* Hero Section */}
            <div
                style={{
                    background: 'linear-gradient(to right, #f6d365, #fda085)',
                    borderRadius: 20,
                    padding: '60px 40px',
                    color: '#4a4a4a',
                    textAlign: 'center',
                    marginBottom: 60,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                }}
            >
                <Title level={1} style={{ color: '#4a4a4a', marginBottom: 20 }}>Phụ kiện thời trang chính hãng</Title>
                <Paragraph style={{ fontSize: 18, maxWidth: 700, margin: '0 auto', color: '#333' }}>
                    Cung cấp các phụ kiện thời trang sang trọng, đa dạng phong cách, từ túi xách, giày dép đến trang sức, giúp bạn nổi bật trong mọi dịp. Chất lượng đảm bảo, dịch vụ chuyên nghiệp và giao hàng nhanh chóng.
                </Paragraph>
                <Button type="primary" size="large" style={{ marginTop: 24, background: '#ff85a2', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 'bold' }}>
                    Khám phá bộ sưu tập
                </Button>
            </div>

            {/* Features Section */}
            <Row gutter={[24, 24]} justify="center">
                {[
                    { icon: <ToolOutlined />, title: 'Đa dạng phong cách', desc: 'Hàng nghìn phụ kiện thời trang, phù hợp mọi phong cách và dịp.' },
                    { icon: <SafetyOutlined />, title: 'Chất lượng cao', desc: 'Sản phẩm được chọn lọc kỹ càng, đảm bảo chất lượng và bền bỉ.' },
                    { icon: <DollarOutlined />, title: 'Giá hợp lý', desc: 'Luôn mang đến giá cả cạnh tranh và ưu đãi hấp dẫn.' },
                ].map((item, index) => (
                    <Col xs={24} md={8} key={index}>
                        <Card
                            hoverable
                            style={{ 
                                borderRadius: 16, 
                                textAlign: 'center', 
                                padding: 20, 
                                background: '#fff', 
                                border: '1px solid #ffe6e1',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div style={{ fontSize: 40, color: '#ff85a2', marginBottom: 16 }}>{item.icon}</div>
                            <Title level={4} style={{ color: '#4a4a4a' }}>{item.title}</Title>
                            <Paragraph style={{ color: '#555' }}>{item.desc}</Paragraph>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Info Section */}
            <Row gutter={[32, 32]} style={{ marginTop: 60 }}>
                <Col xs={24} md={12}>
                    <Card style={{ borderRadius: 16, padding: 24, minHeight: 250, background: '#fff', border: '1px solid #ffe6e1' }}>
                        <Title level={4} style={{ color: '#ff85a2' }}><ClockCircleOutlined style={{ marginRight: 8 }} /> Giờ làm việc</Title>
                        <ul style={{ paddingLeft: 20, marginTop: 16, color: '#555' }}>
                            <li>Thứ 2 - Thứ 7: 09:00 - 21:00</li>
                            <li>Chủ nhật: 10:00 - 18:00</li>
                        </ul>
                        <Tag color="#ff85a2" style={{ marginTop: 16, borderRadius: 8 }}>Gọi trước khi ghé thăm cửa hàng</Tag>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card style={{ borderRadius: 16, padding: 24, minHeight: 250, background: '#fff', border: '1px solid #ffe6e1' }}>
                        <Title level={4} style={{ color: '#ff85a2' }}><EnvironmentOutlined style={{ marginRight: 8 }} /> Liên hệ</Title>
                        <Paragraph style={{ color: '#555' }}>
                            <Text strong>Địa chỉ:</Text> 123 Đường Thời Trang, Quận 1, TP. Hồ Chí Minh
                        </Paragraph>
                        <Paragraph style={{ color: '#555' }}>
                            <PhoneOutlined /> <Text strong>0909 123 456</Text>
                        </Paragraph>
                    </Card>
                </Col>
            </Row>

            {/* Map Section */}
            <div style={{ marginTop: 60 }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 20, color: '#4a4a4a' }}>Vị trí cửa hàng phụ kiện thời trang</Title>
                <iframe
                    title="Phụ kiện Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789!2d106.681!3d10.762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x123456789%3A0xabcdef!2sFashion%20Accessories%20Shop!5e0!3m2!1sen!2s!4v1718800000000!5m2!1sen!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: 16 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
};

export default About;
