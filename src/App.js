import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import ProductDetail from './components/products/ProductDetail';
import ProductDelete from './components/products/ProductDelete';


function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/delete/:id" element={<ProductDelete />} />
        </Routes>
      </Router>
  );
}

export default App;

