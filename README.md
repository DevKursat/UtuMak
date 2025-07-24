# ÜtüMak - Endüstriyel Ütü Çözümleri E-Ticaret Uygulaması

ÜtüMak, endüstriyel ütü çözümleri sunan bir e-ticaret platformudur. Bu proje, ürünleri sergilemek, müşterilerin sepetlerine ürün eklemesini sağlamak ve WhatsApp üzerinden sipariş almayı kolaylaştırmak amacıyla geliştirilmiştir. Ayrıca, ürün yönetimi için bir yönetici paneli de bulunmaktadır.

## Kullanılan Teknolojiler

**Frontend:**
*   **React:** Kullanıcı arayüzü için modern JavaScript kütüphanesi.
*   **React Router DOM:** Tek sayfa uygulama (SPA) yönlendirmesi için.
*   **React Bootstrap:** Responsive ve modern UI bileşenleri için Bootstrap entegrasyonu.
*   **Axios:** API istekleri için HTTP istemcisi.

**Backend:**
*   **Node.js:** Sunucu tarafı çalışma zamanı ortamı.
*   **Express.js:** Node.js için hızlı, esnek ve minimalist web uygulama çatısı.
*   **Supabase:** Veritabanı (PostgreSQL), kimlik doğrulama ve depolama hizmetleri için açık kaynaklı Firebase alternatifi.

## Özellikler

*   **Ürün Vitrini:** Kategorilere göre filtrelenebilir ve aranabilir ürün listesi.
*   **Ürün Detayları:** Ürün kartına tıklayarak detaylı ürün bilgilerini (açıklama, KDV dahil/hariç fiyatlar) görüntüleme.
*   **Sepet Yönetimi:** Ürünleri sepete ekleme ve sepet içeriğini görüntüleme.
*   **WhatsApp Sipariş:** Sepetteki ürünleri otomatik olarak formatlanmış bir mesajla WhatsApp üzerinden sipariş etme.
*   **Yönetici Paneli:** Ürün ekleme, düzenleme ve silme işlemleri için şifre korumalı yönetici arayüzü.
*   **Hakkımızda Sayfası:** Dinamik olarak güncellenebilen Hakkımızda içeriği.
*   **Mobil Uyumlu Tasarım:** Tüm cihazlarda sorunsuz bir kullanıcı deneyimi için responsive tasarım.

## Kurulum ve Çalıştırma (Yerel)

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/DevKursat/UtuMak.git
cd UtuMak
```

### 2. Backend Kurulumu

`server` dizinine gidin ve bağımlılıkları yükleyin:

```bash
cd server
npm install
```

Ardından `server.js` dosyasındaki Supabase kimlik bilgilerini kendi Supabase projenizle güncelleyin ve `db.json` dosyasını (veya Supabase tablonuzu) gerekli verilerle doldurun.

Backend sunucusunu başlatın:

```bash
npm start
# veya node server.js
```

### 3. Frontend Kurulumu

`client` dizinine gidin ve bağımlılıkları yükleyin:

```bash
cd ../client
npm install
```

Frontend uygulamasını başlatın:

```bash
npm start
```

Uygulama genellikle `http://localhost:3000` adresinde çalışacaktır.

## Dağıtım

*   **Frontend:** Bu uygulama, statik site barındırma için **GitHub Pages** kullanılarak dağıtılmıştır.
*   **Backend:** API sunucusu **Render** üzerinde barındırılmaktadır.

## Canlı Demo

Uygulamayı canlı olarak görmek için aşağıdaki adresi ziyaret edebilirsiniz:

[https://utumak.bykursat.me/](https://utumak.bykursat.me/)

## İletişim ve Hakkımda

Bu proje hakkında daha fazla bilgi almak veya benimle iletişime geçmek isterseniz, lütfen [bykursat.me](https://bykursat.me) adresindeki kişisel web sitemi ziyaret edin.

**Kürşat**

