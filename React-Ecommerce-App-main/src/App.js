import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Product from './components/Product';
import Products from './components/Products';
import Cart from './components/Cart';
import About from './components/About';
import Contact from './components/Contact';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path='/products' element={<Product />} />
        <Route exact path='/products/:id' element={<Products />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
