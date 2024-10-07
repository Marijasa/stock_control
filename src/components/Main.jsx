import {useEffect} from "react";
import DollarService from "../services/Dollar.service";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ProductList from "./products/ProductList";
import ProductForm from "./products/ProductForm";
import ProductDetail from "./products/ProductDetail";
import ProductDelete from "./products/ProductDelete";
import {useDispatch} from "react-redux";
import {setDollar} from "../store/dollar.reducer";


const Main = ({children}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        DollarService.getDollarPrice()
            .then((response) => {
                dispatch(setDollar(response.data[0]));
            })
            .catch((error) => {
                console.error('Error fetching dollar price:', error);
            });
    }, []);

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

export default Main;
