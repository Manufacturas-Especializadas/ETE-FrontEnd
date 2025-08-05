import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminIndex from "../pages/Admin/AdminIndex";

const Myroutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/administrador" element={<AdminIndex/>}/>
            </Routes>
        </>
    )
}

export default Myroutes