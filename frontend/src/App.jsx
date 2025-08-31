import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage.jsx';
import BrandBrief from './pages/BrandBrief.jsx';
import MatchConsole from './pages/MatchConsole.jsx';
import BillingPage from './pages/BillingPage.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/brand-brief" element={<BrandBrief />} />
        <Route path="/match-console" element={<MatchConsole />} />
        <Route path="/billing" element={<BillingPage />} />
      </Routes>
    </Router>
  )
}

export default App