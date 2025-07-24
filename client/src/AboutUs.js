import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function AboutUs() {
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/about');
        setAboutContent(response.data.content);
      } catch (err) {
        setError('Hakkımızda içeriği yüklenirken bir hata oluştu.');
        console.error('Error fetching about content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutContent();
  }, []);

  if (loading) {
    return <div className="container mt-5 text-center"><h2>Hakkımızda içeriği yükleniyor...</h2></div>;
  }

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Hakkımızda</h1>
      <ReactMarkdown>{aboutContent}</ReactMarkdown>
    </div>
  );
}

export default AboutUs;
