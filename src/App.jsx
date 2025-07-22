import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Myroutes from "./Routes/routes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <main>
          <Myroutes/>
        </main>
      </BrowserRouter>
    </>
  )
}

export default App