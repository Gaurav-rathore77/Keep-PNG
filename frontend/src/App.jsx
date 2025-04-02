
// import './App.css'
import CreatePost from './pages/CreatePost'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import GetPosts from './pages/GetPosts'
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorPage from './pages/ErrorPage';



function App() {
  return (
    <Router>
      <div className='h-screen w-screen'>
      <Navbar/>
        <Routes>
          <Route path="/" element={<CreatePost />} />
          <Route path="/posts" element={<GetPosts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
         
          <Route path='*' element={<ErrorPage/>} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;

