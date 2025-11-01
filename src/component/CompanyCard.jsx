import React from "react";
import { Link } from "react-router-dom"; 


function CompanyCard({ company }) {

  const rating = Math.round(company.rating || 0);
  const reviewsCount = company.reviewsCount || 0; 

  return (
    <Link 
      to={`/companyreview/${company.id}`} 
      style={{ textDecoration: 'none', color: 'inherit' }} 
    >
      <div className="company-card">
        <div className="logo" style={{ backgroundColor: company.bgColor }}>
          {company.logo}
        </div>

        <div className="info">
          <h3>{company.name}</h3>
          <p className="address">Location: {company.address}</p>

          <div className="rating">
            <span className="stars">
              {"★".repeat(rating) + "☆".repeat(5 - rating)}
            </span>
            <span className="review-count">{reviewsCount} Reviews</span>
          </div>
        </div>

        <div className="footer">
          <span className="date">
            Founded on {company.founded}
          </span>

          <button className="detail-btn">
            Detail Review
          </button>
        </div>
      </div>
    </Link>
  );
}

export default CompanyCard;