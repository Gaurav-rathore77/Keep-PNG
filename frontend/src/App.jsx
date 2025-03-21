
import './App.css'
import CreatePost from './pages/CreatePost'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import GetPosts from './pages/GetPosts'
import Register from './pages/Register';
import Login from './pages/Login';




function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<CreatePost />} />
          <Route path="/posts" element={<GetPosts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
         
          <Route path='*' element={<h1>404</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

