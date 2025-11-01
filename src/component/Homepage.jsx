import React, { useState, useEffect } from "react";
import CompanyCard from "./CompanyCard";



const Home = () => {
 

  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    logo: "",
    bgColor: "#333333",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:3000/companies");
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Search Filter
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort Logic
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "date") {
      return new Date(b.founded) - new Date(a.founded);
    }
    return 0;
  });

  // Add New Company (POST to API)
  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.address) {
      alert("Name and Address are required!");
      return;
    }

    const companyToAdd = {
      logo: newCompany.logo || newCompany.name.charAt(0),
      bgColor: newCompany.bgColor,
      name: newCompany.name,
      address: newCompany.address,
      founded: new Date().toISOString().split("T")[0], 
      rating: 0,
      reviews: 0,
    };

    try {
      const response = await fetch("http://localhost:3000/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyToAdd),
      });

      if (!response.ok) throw new Error("Failed to add company");

      const addedCompany = await response.json();
      setCompanies([addedCompany, ...companies]);
      setNewCompany({ name: "", address: "", logo: "", bgColor: "#333333" });
      setShowAddForm(false);
    } catch (err) {
      alert("Error adding company: " + err.message);
    }
  };

  // Loading & Error States
  if (loading) return <div className="loading">Loading companies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="search-section">
          <label>Select City</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Indore, Madhya Pradesh, India"
              className="city-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="location-icon">Location</span>
          </div>
          <button className="find-btn">Find Company</button>
          <button
            className="add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "+ Add Company"}
          </button>
        </div>

        <div className="sort-section">
          <label>Sort:</label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

     
      {showAddForm && (
        <div className="add-form-container">
          <h3>Add New Company</h3>
          <form onSubmit={handleAddCompany} className="add-form">
            <input
              type="text"
              placeholder="Company Name"
              value={newCompany.name}
              onChange={(e) =>
                setNewCompany({ ...newCompany, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={newCompany.address}
              onChange={(e) =>
                setNewCompany({ ...newCompany, address: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Logo (e.g. G or Light Bulb)"
              value={newCompany.logo}
              onChange={(e) =>
                setNewCompany({ ...newCompany, logo: e.target.value })
              }
            />
            <input
              type="color"
              value={newCompany.bgColor}
              onChange={(e) =>
                setNewCompany({ ...newCompany, bgColor: e.target.value })
              }
            />
            <button type="submit" className="submit-add-btn">
              Add Company
            </button>
          </form>
        </div>
      )}

      
      <div className="results">Result Found: {sortedCompanies.length}</div>

   
      <div className="company-list">
        {sortedCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}

export default Home;
