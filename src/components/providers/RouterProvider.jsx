import {BrowserRouter as Router} from "react-router-dom";


const RouterProvider = ({ children }) => {
    return (
        <Router>
            {children}
        </Router>
    );
}

export default RouterProvider;
