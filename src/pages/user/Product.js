/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Input, Checkbox, Slider, Typography, Spin, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';
import 'antd/dist/reset.css';

const { Title } = Typography;
const { Search } = Input;

const API_URL = process.env.REACT_APP_API_URL;

const Product = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data.data.map(cat => cat.name));
            } catch (err) {
                console.error(err);
                toast.error("Lỗi khi tải danh mục");
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleClickProduct = (product) => {
        if (!product.status) return; // Không cho click nếu ngừng bán
        navigate(`/products/${product.slug}`, { state: { id: product.id } });
    };

    const handlePageChange = (page, pageSize) => {
        setFilters({ ...filters, page, pageSize });
    };

    return (
        <div style={{ padding: 24 }}>
            <Toaster position="top-center" />
            <Row gutter={24}>
                <Col xs={24} md={6}>
                    <Title level={4}>Lọc sản phẩm</Title>
                    <Search
                        placeholder="Tìm kiếm..."
                        onSearch={(value) => setFilters({ ...filters, keyword: value, page: 1 })}
                        style={{ marginBottom: 16 }}
                    />
                    <Title level={5}>Phân loại phụ kiện</Title>
                    <Checkbox.Group
                        options={categories}
                        value={filters.category}
                        onChange={(checked) => setFilters({ ...filters, category: checked, page: 1 })}
                        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}
                    />
                    <Title level={5}>Giá sản phẩm</Title>
                    <Slider
                        range
                        min={0}
                        max={10000000}
                        step={1000}
                        value={filters.price}
                        onChange={(value) => setFilters({ ...filters, price: value, page: 1 })}
                        tooltipVisible
                        style={{ marginBottom: 16 }}
                    />
                    <div>Giá: {filters.price[0].toLocaleString()}đ - {filters.price[1].toLocaleString()}đ</div>
                </Col>

                <Col xs={24} md={18}>
                    <Title level={4}>Tất cả sản phẩm</Title>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            <Row gutter={[16, 16]}>
                                {products.map(p => (
                                    <Col xs={12} sm={8} md={6} key={p.id}>
                                        <Card
                                            hoverable={p.status}
                                            style={{
                                                opacity: p.status ? 1 : 0.6,
                                                borderRadius: 8,
                                                transition: '0.3s'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    cursor: p.status ? 'pointer' : 'default'
                                                }}
                                                onClick={() => handleClickProduct(p)}
                                            >
                                                {p.image ? (
                                                    <img
                                                        src={`${p.image}`}
                                                        alt={p.name}
                                                        style={{
                                                            height: 150,
                                                            objectFit: 'cover',
                                                            width: '100%',
                                                            borderRadius: 8,
                                                            filter: p.status ? 'none' : 'grayscale(80%)'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        height: 150,
                                                        background: '#f0f0f0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#999',
                                                        borderRadius: 8,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        Chưa có ảnh
                                                    </div>
                                                )}
                                                {!p.status && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        left: 8,
                                                        background: 'red',
                                                        color: '#fff',
                                                        padding: '2px 6px',
                                                        borderRadius: 4,
                                                        fontSize: 12,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        Ngừng bán
                                                    </div>
                                                )}
                                            </div>

                                            <Card.Meta
                                                title={
                                                    <div
                                                        style={{
                                                            marginTop: 8,
                                                            cursor: p.status ? 'pointer' : 'default',
                                                            color: p.status ? '#111' : '#555',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {p.name}
                                                    </div>
                                                }
                                                description={
                                                    !p.status ? (
                                                        <div style={{ color: '#555', fontWeight: 'bold', marginTop: 4 }}>
                                                            Liên hệ người bán
                                                        </div>
                                                    ) : p.discount ? (
                                                        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <div style={{ textDecoration: 'line-through', color: '#888' }}>
                                                                {formatCurrency(Number(p.originalPrice))}
                                                            </div>
                                                            <div style={{ color: 'red', fontWeight: 'bold' }}>
                                                                {formatCurrency(Number(p.finalPrice))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ marginTop: 4, fontWeight: 'bold', color: '#111' }}>
                                                            {formatCurrency(Number(p.price))}
                                                        </div>
                                                    )
                                                }
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {totalProducts > filters.pageSize && (
                                <div style={{ textAlign: 'center', marginTop: 24 }}>
                                    <Pagination
                                        current={filters.page}
                                        pageSize={filters.pageSize}
                                        total={totalProducts}
                                        onChange={handlePageChange}
                                        showSizeChanger
                                        pageSizeOptions={['8', '12', '16', '24']}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Product;
