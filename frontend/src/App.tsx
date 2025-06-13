import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./providers/Web3Provider";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";
import "./App.css";

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
