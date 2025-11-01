import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./component/Homepage";
// import CompanyCard from "./component/CompanyCard";
import ReviewPage from "./component/Reviewpage";
import Layout from "./Navbar/Outlet";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout/>}>
        <Route path="/home" element={<Home/>} />
        <Route index element={<Home/>} />

        <Route path="/companyreview" element={<ReviewPage/>} />
        <Route path="/companyreview/:companyId" element={<ReviewPage />} />
        <Route path="/company/:companyId" element={<ReviewPage />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
