 import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
 import './App.css';
 import PageSpace from './pages/PageSpace';  

function App() {
 
  return (
    <Router>
        <Routes>
          <Route path="/" element={<PageSpace />} />  
        </Routes>
    </Router>
  );
}

export default App;
