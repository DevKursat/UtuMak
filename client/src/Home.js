import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './Home.css'; // FAB için yeni CSS dosyası ekliyorum

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://utumak.onrender.com/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['Tümü', ...new Set(products.map(product => product.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const calculateItemPriceWithVat = (item) => {
    const price = parseFloat(item.price);
    const vatRate = parseFloat(item.vatRate || 20); // Varsayılan %20 KDV
    const vatAmount = price * (vatRate / 100);
    return (price + vatAmount);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + calculateItemPriceWithVat(item) * item.quantity, 0).toFixed(2);
  };

  const getTotalVatAmount = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      const vatRate = parseFloat(item.vatRate || 20);
      const vatAmount = price * (vatRate / 100);
      return total + (vatAmount * item.quantity);
    }, 0).toFixed(2);
  };

  const getTotalPriceWithoutVat = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) {
      alert('Sepetiniz boş. Lütfen önce ürün ekleyin.');
      return;
    }

    let message = 'Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n\n';
    cart.forEach((item) => {
      const priceWithoutVat = parseFloat(item.price).toFixed(2);
      const vatRate = parseFloat(item.vatRate || 20);
      const vatAmount = (priceWithoutVat * (vatRate / 100)).toFixed(2);
      const priceWithVat = (parseFloat(priceWithoutVat) + parseFloat(vatAmount)).toFixed(2);

      message += `* ${item.name} (x${item.quantity})\n`;
      message += `  Fiyat (KDV Hariç): ${priceWithoutVat} TL\n`;
      message += `  KDV (%${vatRate}): ${vatAmount} TL\n`;
      message += `  Toplam (KDV Dahil): ${priceWithVat} TL\n\n`;
    });
    message += `Toplam Tutar (KDV Hariç): ${getTotalPriceWithoutVat()} TL\n`;
    message += `Toplam KDV: ${getTotalVatAmount()} TL\n`;
    message += `Genel Toplam (KDV Dahil): ${getTotalPrice()} TL\n\n`;
    message += 'Lütfen siparişimle ilgili benimle iletişime geçin.';

    // WhatsApp telefon numarası buraya gelecek
    const whatsappPhoneNumber = '905335114689'; // Lütfen bu numarayı güncelleyin!
    const whatsappUrl = `https://wa.me/${whatsappPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    handleCloseModal();
  };

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-4">Ürünlerimiz</h1>
        <p className="lead">Kaliteli ve güvenilir endüstriyel ütü çözümleri</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <img src={`https://utumak.onrender.com${product.imageUrl}`} className="card-img-top" alt={product.name} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">Kategori: {product.category}</p>
                  <p className="card-text flex-grow-1">{product.description}</p>
                  <p className="card-text fs-5 text-end">
                    KDV Hariç: <strong>{parseFloat(product.price).toFixed(2)} TL</strong><br/>
                    KDV (%{product.vatRate || 20}): <strong>{(parseFloat(product.price) * (parseFloat(product.vatRate || 20) / 100)).toFixed(2)} TL</strong><br/>
                    KDV Dahil: <strong>{calculateItemPriceWithVat(product).toFixed(2)} TL</strong>
                  </p>
                  <button className="btn btn-primary mt-auto" onClick={() => addToCart(product)}>
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>Ürün bulunamadı.</p>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fab-container">
          <button className="fab" onClick={handleShowModal}>
            <i className="bi bi-cart-fill"></i> {cart.reduce((total, item) => total + item.quantity, 0)}
          </button>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sipariş Özeti</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Aşağıdaki ürünleri WhatsApp üzerinden sipariş etmek üzeresiniz:</p>
          <ul className="list-group">
            {cart.map(item => (
              <li key={item.id} className="list-group-item">
                <div>
                  <h6 className="my-0">{item.name} (x{item.quantity})</h6>
                  <small className="text-muted">KDV Hariç: {parseFloat(item.price).toFixed(2)} TL</small><br/>
                  <small className="text-muted">KDV (%{item.vatRate || 20}): {(parseFloat(item.price) * (parseFloat(item.vatRate || 20) / 100)).toFixed(2)} TL</small><br/>
                  <strong>Toplam (KDV Dahil): {calculateItemPriceWithVat(item).toFixed(2)} TL</strong>
                </div>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between align-items-center active">
              <strong>Toplam Tutar (KDV Hariç):</strong>
              <strong>{getTotalPriceWithoutVat()} TL</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center active">
              <strong>Toplam KDV:</strong>
              <strong>{getTotalVatAmount()} TL</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center active">
              <strong>Genel Toplam (KDV Dahil):</strong>
              <strong>{getTotalPrice()} TL</strong>
            </li>
          </ul>
          <p className="mt-3">Devam etmek için "WhatsApp ile Gönder" butonuna tıklayın.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            İptal
          </Button>
          <Button variant="success" onClick={sendWhatsAppOrder}>
            WhatsApp ile Gönder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;