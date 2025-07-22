import { useNavigate } from "react-router-dom"
import DeadTiemsForm from "../../components/DeadTiemsForm/DeadTiemsForm"
import ProductionForm from "../../components/ProductionForm/ProductionForm"
import ProductionHeader from "../../components/ProductionHeader/ProductionHeader"

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) =>{
        navigate(path);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <form className="max-w-7xl mx-auto">
                    <ProductionHeader/>

                    <div className="flex flex-col lg:flex-row gap-6 mt-6">
                        <div className="w-full lg:w-1/2">
                            <ProductionForm/>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <DeadTiemsForm/>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            className="flex items-center justify-center px-6 py-3 border border-transparent
                            shadow-sm text-base font-medium rounded-md bg-primary hover:bg-secondary hover:cursor-pointer
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Registrar
                        </button>
                        <button
                            onClick={() => handleNavigate("/dashboard") }
                            className="flex items-center justify-center px-6 py-3 border
                            border-gray-300 shadow-sm text-base font-medium rounded-md
                            text-gray-700 bg-white hover:bg-amber-50 hover:cursor-pointer 
                            focus:outline-none focus:ring-2 focus:ring-primary transition-colors"                            
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        Dashboard
                    </button>  
                    </div>
                </form>               
            </div>
        </>
    )
}

export default HomePage