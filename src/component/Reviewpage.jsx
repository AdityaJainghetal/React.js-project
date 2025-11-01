import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', subject: '', text: '', rating: 5 });
  const [showForm, setShowForm] = useState(false);

  const getConsistentRandom = (str, id, max = 100) => {
    let hash = 0;
    const input = `${str}${id}`;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash + char) & 0xffffffff;
    }
    return Math.abs(hash) % max;
  };

  
  const getGenderFromName = (name) => {
    const femaleNames = ['ankita', 'ayushi'];;
    const maleNames = ['ankit', 'ram', 'pawan']

    const first = name.trim().split(' ')[0].toLowerCase();

    if (femaleNames.some(n => first.includes(n.toLowerCase()))) return 'women';
    if (maleNames.some(n => first.includes(n.toLowerCase()))) return 'men';

    
    return getConsistentRandom(name, '', 2) === 0 ? 'women' : 'men';
  };
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:3000/companies/${companyId}`),
          fetch(`http://localhost:3000/reviews?companyId=${companyId}`)
        ]);

        if (!companyRes.ok) throw new Error('Company not found');
        const companyData = await companyRes.json();
        const reviewsData = await reviewsRes.json();

        setCompany(companyData);
        setReviews(reviewsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rating) => setFormData({ ...formData, rating });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.text) {
      alert('Fill all fields');
      return;
    }

    const newReview = {
      companyId: parseInt(companyId),
      name: formData.name,
      date: new Date().toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).replace(',', ''),
      subject: formData.subject,
      text: formData.text,
      rating: formData.rating,
    };

    try {
      const reviewRes = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      const addedReview = await reviewRes.json();

      const total = reviews.reduce((s, r) => s + r.rating, 0) + formData.rating;
      const count = reviews.length + 1;
      const avgRating = total / count;

      await fetch(`http://localhost:3000/companies/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewsCount: count, rating: avgRating }),
      });

      setReviews([addedReview, ...reviews]);
      setCompany({ ...company, reviewsCount: count, rating: avgRating });
      setFormData({ name: '', subject: '', text: '', rating: 5 });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        className={`star ${interactive ? 'interactive' : ''} ${star <= rating ? 'filled' : ''}`}
        onClick={() => interactive && handleRating(star)}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
      >
        {star <= rating ? '★' : '☆'}
      </span>
    ));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <div className="container">

      <div className="header">
        <div className="logo">
          <div className="logo-circle" style={{ backgroundColor: company.bgColor }}>
            {company.logo}
          </div>
        </div>
        <div className="company-info">
          <h1>{company.name}</h1>
          <p className="address">Location: {company.address}</p>
          <div className="rating">
            <span className="stars">{renderStars(Math.round(company.rating || 0))}</span>
            <span className="reviews-count">{company.reviewsCount || 0} Reviews</span>
          </div>
        </div>
        <button className="add-review-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Review'}
        </button>
        <p className="founded">Founded on {company.founded}</p>
      </div>

      <hr className="divider" />

      {showForm && (
        <div className="review-form-container">
          <h3>Add Your Review</h3>
          <form onSubmit={handleSubmit} className="review-form">
            <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input name="subject" placeholder="Review Subject" value={formData.subject} onChange={handleChange} required />
            <textarea name="text" placeholder="Write your review..." rows="4" value={formData.text} onChange={handleChange} required></textarea>
            <div className="form-rating">
              <span>Rating: </span>
              {renderStars(formData.rating, true)}
            </div>
            <button type="submit" className="submit-btn">Submit Review</button>
          </form>
        </div>
      )}

      <p className="result-count">Result Found: {reviews.length}</p>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => {
            const gender = getGenderFromName(review.name);
            const imageId = getConsistentRandom(review.name, review.id, 90) + 10;   // 10-99

            return (
              <div key={review.id} className="review">
                <img
                  src={`https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`}
                  alt={review.name}
                  className="reviewer-img"
                  onError={e => { e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg'; }}
                />
                <div className="review-content">
                  <div className="reviewer-name">{review.name}</div>
                  <div className="review-date">{review.date}</div>
                  <div className="review-subject">{review.subject}</div>
                  <p className="review-text">{review.text}</p>
                  <div className="review-rating">{renderStars(review.rating)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewPage;