const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase istemcisini başlat
const supabaseUrl = 'https://fsdrgcanlppombckyoei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZHJnY2FubHBwb21iY2t5b2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMDUyNzIsImV4cCI6MjA2ODg4MTI3Mn0.Utbp1oSRh0-WVBfgu5_iDKFIHmtIz1REkRzupSEP0Ig';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
// app.use('/images', express.static(path.join(__dirname, 'images'))); // Resimler Supabase'den gelecekse bu satır kaldırılabilir

// --- API Endpoints ---

// Get all products
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Error fetching products' });
  }
  res.json(data);
});

// Get About Us content
app.get('/api/about', async (req, res) => {
    const { data, error } = await supabase
        .from('about_content')
        .select('content')
        .eq('id', 'about_us') // 'about_us' ID'li içeriği çek
        .single();

    if (error) {
        console.error('Error fetching about content:', error);
        return res.status(500).json({ success: false, message: 'Error fetching about content' });
    }
    res.json({ content: data ? data.content : '' });
});

// Admin login
app.post('/admin/login', async (req, res) => {
    const { password } = req.body;
    const { data, error } = await supabase
        .from('admin_credentials')
        .select('password')
        .eq('id', 'admin')
        .single();

    if (error || !data) {
        console.error('Error fetching admin credentials:', error);
        return res.status(500).json({ success: false, message: 'Login error' });
    }

    if (password === data.password) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Add a new product
app.post('/admin/add-product', async (req, res) => {
    const { name, price, imageUrl, category, description, vatRate, password } = req.body;

    const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('password')
        .eq('id', 'admin')
        .single();

    if (adminError || !adminData || password !== adminData.password) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!name || !price || !imageUrl || !category || !description || vatRate === undefined) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newProduct = {
        id: Date.now().toString(), // Supabase'de otomatik ID varsa bu kaldırılabilir
        name,
        price: parseFloat(price),
        imageUrl,
        category,
        description,
        "vatRate": parseFloat(vatRate)
    };

    const { data, error } = await supabase
        .from('products')
        .insert([newProduct]);

    if (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ success: false, message: 'Error adding product' });
    }

    res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
});

// Delete Product (Admin only)
app.delete('/admin/delete-product/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('password')
        .eq('id', 'admin')
        .single();

    if (adminError || !adminData || password !== adminData.password) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, message: 'Error deleting product' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
});

// Edit Product (Admin only)
app.put('/admin/edit-product/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, imageUrl, category, description, vatRate, password } = req.body;

    const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('password')
        .eq('id', 'admin')
        .single();

    if (adminError || !adminData || password !== adminData.password) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!name || !price || !imageUrl || !category || !description || vatRate === undefined) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const { data, error } = await supabase
        .from('products')
        .update({ name, price: parseFloat(price), imageUrl, category, description, "vatRate": parseFloat(vatRate) })
        .eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ success: false, message: 'Error updating product' });
    }

    res.json({ success: true, message: 'Product updated successfully', product: { id, name, price: parseFloat(price), imageUrl, category, description, vatRate: parseFloat(vatRate) } });
});

// Update About Us content (Admin only)
app.post('/admin/update-about', async (req, res) => {
    const { content, password } = req.body;

    const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('password')
        .eq('id', 'admin')
        .single();

    if (adminError || !adminData || password !== adminData.password) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { data, error } = await supabase
        .from('about_content')
        .update({ content })
        .eq('id', 'about_us');

    if (error) {
        console.error('Error updating about content:', error);
        return res.status(500).json({ success: false, message: 'Error updating about content' });
    }

    res.json({ success: true, message: 'About content updated successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});