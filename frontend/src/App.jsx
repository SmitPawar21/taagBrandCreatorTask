import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage.jsx';
import BrandBrief from './pages/BrandBrief.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/brand-brief" element={<BrandBrief />} />
      </Routes>
    </Router>
  )
}

export default App