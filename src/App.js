
import Main from "./components/Main";

import StoreProvider from "./components/providers/StoreProvider";


function App() {
    return (
        <StoreProvider>
            <Main/>
        </StoreProvider>
    );
}

export default App;

