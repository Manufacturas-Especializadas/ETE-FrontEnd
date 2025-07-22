import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import Dashboard from "../pages/Dashboard/Dashboard";

const Myroutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </>
    )
}

export default Myroutes