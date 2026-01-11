/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input, Checkbox, Slider, Typography, Spin, Pagination, Upload, Button, Tooltip, Empty } from 'antd';
import { CameraOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';
import 'antd/dist/reset.css';

const { Title, Text } = Typography;
const { Search } = Input;

const API_URL = process.env.REACT_APP_API_URL;

const Product = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // --- STATE MỚI ĐỂ QUẢN LÝ KẾT QUẢ AI ---
    const [aiKeyword, setAiKeyword] = useState(null);

    const [filters, setFilters] = useState({
        category: [],
        price: [0, 10000000],
        keyword: '',
        page: 1,
        pageSize: 12
    });
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/products`, {
                params: {
                    categories: filters.category.join(','),
                    priceMin: filters.price[0],
                    priceMax: filters.price[1],
                    search: filters.keyword,
                    page: filters.page,
                    pageSize: filters.pageSize
                }
            });
            setProducts(res.data.data || []);
            setTotalProducts(res.data.total || 0);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi tải sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleImageSearch = async (options) => {
        const { file } = options;
        setLoading(true);
        setIsAiLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post(`${API_URL}/products/search-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                setProducts(res.data.data);
                setTotalProducts(res.data.data.length);
                setAiKeyword(res.data.keyword); // Lưu từ khóa AI nhận diện được
                toast.success(`Nhận diện: "${res.data.keyword}"`);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Không thể nhận diện hình ảnh");
            setAiKeyword(null);
            fetchProducts();
        } finally {
            setLoading(false);
            setIsAiLoading(false);
        }
    };

    // --- HÀM QUAY LẠI TRẠNG THÁI BAN ĐẦU ---
    const handleResetSearch = () => {
        setAiKeyword(null); // Xóa từ khóa AI
        setFilters({ ...filters, page: 1 }); // Trigger useEffect gọi fetchProducts
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data.data.map(cat => cat.name));
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Chỉ fetch tự động nếu KHÔNG phải đang hiển thị kết quả AI
        if (!aiKeyword) {
            fetchProducts();
        }
    }, [filters, aiKeyword]);

    const handleClickProduct = (product) => {
        if (!product.status) return;
        navigate(`/products/${product.slug}`, { state: { id: product.id } });
    };

    const handlePageChange = (page, pageSize) => {
        setFilters({ ...filters, page, pageSize });
    };

    return (
        <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
            <Toaster position="top-center" />
            <Row gutter={32}>
                {/* CỘT BÊN TRÁI: BỘ LỌC */}
                <Col xs={24} md={6}>
                    <Card variant={'borderless'} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Title level={4}>Lọc sản phẩm</Title>

                        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                            <Search
                                placeholder="Tìm kiếm..."
                                value={filters.keyword}
                                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                onSearch={(value) => {
                                    setAiKeyword(null); // Tắt chế độ AI khi tìm bằng text
                                    setFilters({ ...filters, keyword: value, page: 1 });
                                }}
                                enterButton
                            />
                            <Upload
                                customRequest={handleImageSearch}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Tooltip title="Tìm bằng hình ảnh (AI)">
                                    <Button
                                        type={aiKeyword ? "primary" : "default"}
                                        icon={<CameraOutlined />}
                                        loading={isAiLoading}
                                        style={{ height: 32 }}
                                    />
                                </Tooltip>
                            </Upload>
                        </div>

                        <Title level={5}>Phân loại</Title>
                        <Checkbox.Group
                            options={categories}
                            value={filters.category}
                            onChange={(checked) => {
                                setAiKeyword(null);
                                setFilters({ ...filters, category: checked, page: 1 });
                            }}
                            style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}
                        />

                        <Title level={5}>Giá sản phẩm</Title>
                        <Slider
                            range
                            min={0}
                            max={10000000}
                            step={50000}
                            value={filters.price}
                            onChange={(value) => setFilters({ ...filters, price: value })}
                            onAfterChange={() => {
                                setAiKeyword(null);
                                setFilters(prev => ({ ...prev, page: 1 }));
                            }}
                        />
                        <Text type="secondary">
                            {formatCurrency(filters.price[0])} - {formatCurrency(filters.price[1])}
                        </Text>
                    </Card>
                </Col>

                {/* CỘT BÊN PHẢI: DANH SÁCH SẢN PHẨM */}
                <Col xs={24} md={18}>
                    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {aiKeyword ? (
                                <div>
                                    <Title level={4} style={{ margin: 0 }}>
                                        Kết quả cho: <span style={{ color: '#1890ff' }}>"{aiKeyword}"</span>
                                    </Title>
                                    <Text type="secondary">Tìm thấy {products.length} sản phẩm phù hợp</Text>
                                </div>
                            ) : (
                                <Title level={4} style={{ margin: 0 }}>
                                    {filters.keyword ? `Kết quả cho: "${filters.keyword}"` : "Tất cả sản phẩm"}
                                </Title>
                            )}
                        </div>

                        {/* NÚT QUAY LẠI KHI CÓ KẾT QUẢ AI */}
                        {aiKeyword && (
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={handleResetSearch}
                                type="primary"
                            >
                                Quay lại danh sách chính
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px 0' }}>
                            <Spin size="large" tip={isAiLoading ? "AI đang phân tích ảnh..." : "Đang tải..."} />
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <Row gutter={[16, 24]}>
                                {products.map(p => (
                                    <Col xs={12} sm={8} md={6} key={p.id}>
                                        <Card
                                            hoverable={p.status}
                                            onClick={() => handleClickProduct(p)}
                                            cover={
                                                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            filter: p.status ? 'none' : 'grayscale(100%)'
                                                        }}
                                                    />
                                                    {!p.status && (
                                                        <div style={{
                                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                                            background: 'rgba(0,0,0,0.4)', color: '#fff',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                                        }}>
                                                            HẾT HÀNG
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        >
                                            <Card.Meta
                                                title={<Text strong ellipsis={{ tooltip: p.name }}>{p.name}</Text>}
                                                description={
                                                    <div>
                                                        {p.discount ? (
                                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                                <Text delete type="secondary" style={{ fontSize: 12 }}>
                                                                    {formatCurrency(p.originalPrice)}
                                                                </Text>
                                                                <Text type="danger" strong>
                                                                    {formatCurrency(p.finalPrice)}
                                                                </Text>
                                                            </div>
                                                        ) : (
                                                            <Text strong>{formatCurrency(p.price)}</Text>
                                                        )}
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {/* Chỉ hiện phân trang nếu không phải kết quả AI */}
                            {!aiKeyword && totalProducts > filters.pageSize && (
                                <div style={{ textAlign: 'center', marginTop: 40 }}>
                                    <Pagination
                                        current={filters.page}
                                        pageSize={filters.pageSize}
                                        total={totalProducts}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <Empty description="Không tìm thấy sản phẩm nào" style={{ marginTop: 100 }} />
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Product;