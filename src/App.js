
import Main from "./components/Main";

import store from "./store/store";
import {Provider} from "react-redux";


function App() {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>
    );
}

export default App;

