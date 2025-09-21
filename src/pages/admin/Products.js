import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import '../../styles/admin/Products.css';

const Products = () => {
  const { 
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    refetch
  } = useAdmin();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    sortBy: 'newest',
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    featured: false,
  });

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      !filters.category || product.category === filters.category
    )
    .filter(product => 
      !filters.status || 
      (filters.status === 'inStock' && product.stock > 0) ||
      (filters.status === 'outOfStock' && product.stock <= 0)
    )
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

  // Get current products for pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      sortBy: 'newest',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Open add product modal
  const openAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: '',
      featured: false,
    });
    setIsAddModalOpen(true);
  };

  // Open edit product modal
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      featured: product.featured || false,
    });
    setIsAddModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      };
      
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.id);
      setIsDeleteModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Confirm delete
  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Close all modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  // Fetch products on component mount
  useEffect(() => {
    refetch();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="products-admin">
      <div className="products-header">
        <h2>Products Management</h2>
        <button 
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <FaPlus className="btn-icon" /> Add Product
        </button>
      </div>

      <div className="products-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-container">
          <button 
            className="btn btn-outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="btn-icon" /> Filters
          </button>
          
          {showFilters && (
            <div className="filters-dropdown">
              <div className="filter-group">
                <label>Category</label>
                <select 
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="painting">Paintings</option>
                  <option value="sculpture">Sculptures</option>
                  <option value="photography">Photography</option>
                  <option value="digital">Digital Art</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Status</label>
                <select 
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Sort By</label>
                <select 
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="priceLow">Price (Low to High)</option>
                  <option value="priceHigh">Price (High to Low)</option>
                </select>
              </div>
              
              <button 
                className="btn btn-text"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="products-table-container">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Try adjusting your search or filters.</p>
            <button 
              className="btn btn-primary"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-info">
                        <div 
                          className="product-image"
                          style={{ backgroundImage: `url(${product.image})` }}
                        ></div>
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-description">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="category">
                      <span className={`category-badge ${product.category || 'uncategorized'}`}>
                        {product.category || 'Uncategorized'}
                      </span>
                      {product.featured && (
                        <span className="featured-badge">Featured</span>
                      )}
                    </td>
                    <td className="price">${product.price.toFixed(2)}</td>
                    <td className="stock">
                      <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span className="stock-count">({product.stock})</span>
                    </td>
                    <td>
                      <span className={`status-badge ${product.status || 'active'}`}>
                        {product.status === 'draft' ? 'Draft' : 'Active'}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-icon"
                        onClick={() => openEditModal(product)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-icon danger"
                        onClick={() => confirmDelete(product)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="pagination-container">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={paginate}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={closeModals}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="painting">Paintings</option>
                    <option value="sculpture">Sculptures</option>
                    <option value="photography">Photography</option>
                    <option value="digital">Digital Art</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  <span>Featured Product</span>
                </label>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Delete Product</h3>
              <button className="close-btn" onClick={closeModals}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={closeModals}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
