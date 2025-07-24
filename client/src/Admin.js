import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'; // Assuming you have an Admin.css for styling

function Admin() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productVatRate, setProductVatRate] = useState(20); // Default VAT rate to 20
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [aboutContent, setAboutContent] = useState('');
  const [editingProduct, setEditingProduct] = useState(null); // State to hold product being edited

  useEffect(() => {
    if (loggedIn) {
      fetchProducts();
      fetchAboutContent();
    }
  }, [loggedIn]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://utumak.onrender.com/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Ürünler yüklenirken hata oluştu.');
    }
  };

  const fetchAboutContent = async () => {
    try {
      const response = await axios.get('https://utumak.onrender.com/api/about');
      setAboutContent(response.data.content);
    } catch (error) {
      console.error('Error fetching about content:', error);
      setMessage('Hakkımızda içeriği yüklenirken hata oluştu.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://utumak.onrender.com/admin/login', { password });
      if (response.data.success) {
        setLoggedIn(true);
        setMessage('Giriş başarılı!');
      } else {
        setMessage('Yanlış şifre.');
      }
    } catch (error) {
      setMessage('Giriş sırasında bir hata oluştu.');
      console.error('Login error:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://utumak.onrender.com/admin/add-product', {
        name: productName,
        price: productPrice,
        imageUrl: productImageUrl,
        category: productCategory,
        description: productDescription,
        vatRate: productVatRate,
        password: password, // Send password for authorization
      });
      if (response.data.success) {
        setMessage('Ürün başarıyla eklendi!');
        setProductName('');
        setProductPrice('');
        setProductImageUrl('');
        setProductCategory('');
        setProductDescription('');
        setProductVatRate(20); // Reset to default
        fetchProducts(); // Refresh product list
      } else {
        setMessage('Ürün eklenirken hata oluştu: ' + response.data.message);
      }
    } catch (error) {
      setMessage('Ürün eklenirken bir hata oluştu.');
      console.error('Add product error:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`https://utumak.onrender.com/admin/delete-product/${id}`, {
        data: { password: password }, // Send password in request body for DELETE
      });
      if (response.data.success) {
        setMessage('Ürün başarıyla silindi!');
        fetchProducts(); // Refresh product list
      } else {
        setMessage('Ürün silinirken hata oluştu: ' + response.data.message);
      }
    } catch (error) {
      setMessage('Ürün silinirken bir hata oluştu.');
      console.error('Delete product error:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductImageUrl(product.imageUrl);
    setProductCategory(product.category || '');
    setProductDescription(product.description || '');
    setProductVatRate(product.vatRate || 20);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://utumak.onrender.com/admin/edit-product/${editingProduct.id}`, {
        name: productName,
        price: productPrice,
        imageUrl: productImageUrl,
        category: productCategory,
        description: productDescription,
        vatRate: productVatRate,
        password: password,
      });
      if (response.data.success) {
        setMessage('Ürün başarıyla güncellendi!');
        setEditingProduct(null);
        setProductName('');
        setProductPrice('');
        setProductImageUrl('');
        setProductCategory('');
        setProductDescription('');
        setProductVatRate(20); // Reset to default
        fetchProducts();
      } else {
        setMessage('Ürün güncellenirken hata oluştu: ' + response.data.message);
      }
    } catch (error) {
      setMessage('Ürün güncellenirken bir hata oluştu.');
      console.error('Update product error:', error);
    }
  };

  const handleUpdateAboutContent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://utumak.onrender.com/admin/update-about', {
        content: aboutContent,
        password: password,
      });
      if (response.data.success) {
        setMessage('Hakkımızda içeriği başarıyla güncellendi!');
      } else {
        setMessage('Hakkımızda içeriği güncellenirken hata oluştu: ' + response.data.message);
      }
    } catch (error) {
      setMessage('Hakkımızda içeriği güncellenirken bir hata oluştu.');
      console.error('Update about content error:', error);
    }
  };

  if (!loggedIn) {
    return (
      <div className="admin-container">
        <h2>Admin Girişi</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Şifre:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Giriş Yap</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>Admin Paneli</h2>
      {message && <p className="message">{message}</p>}

      <div className="admin-section">
        <h3>{editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
          <div className="form-group">
            <label>Ürün Adı:</label>
            <input
              type="text"
              className="form-control"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Ürün Fiyatı:</label>
            <input
              type="number"
              className="form-control"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Ürün Resim URL:</label>
            <input
              type="text"
              className="form-control"
              value={productImageUrl}
              onChange={(e) => setProductImageUrl(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Kategori:</label>
            <input
              type="text"
              className="form-control"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Açıklama:</label>
            <textarea
              className="form-control"
              rows="3"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>KDV Oranı (%):</label>
            <input
              type="number"
              className="form-control"
              value={productVatRate}
              onChange={(e) => setProductVatRate(parseFloat(e.target.value))}
              step="0.01"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            {editingProduct ? 'Ürünü Güncelle' : 'Ürün Ekle'}
          </button>
          {editingProduct && (
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingProduct(null)}>
              İptal
            </button>
          )}
        </form>
      </div>

      <div className="admin-section mt-5">
        <h3>Mevcut Ürünler</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Adı</th>
              <th>Fiyatı</th>
              <th>KDV Oranı (%)</th>
              <th>Kategori</th>
              <th>Açıklama</th>
              <th>Resim URL</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.vatRate}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>{product.imageUrl}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(product)}>Düzenle</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section mt-5">
        <h3>Hakkımızda İçeriğini Düzenle (Markdown)</h3>
        <form onSubmit={handleUpdateAboutContent}>
          <div className="form-group">
            <label>Hakkımızda İçeriği:</label>
            <textarea
              className="form-control"
              rows="10"
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Hakkımızda İçeriğini Güncelle</button>
        </form>
      </div>
    </div>
  );
}

export default Admin;