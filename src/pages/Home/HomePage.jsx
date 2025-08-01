import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeadTimesForm from "../../components/DeadTimesForm/DeadTiemsForm";
import ProductionForm from "../../components/ProductionForm/ProductionForm";
import ProductionHeader from "../../components/ProductionHeader/ProductionHeader";
import config from "../../../config";
import Swal from "sweetalert2";

const HomePage = () => {
    const [productionData, setProductionData] = useState({
        time: "",
        line_origin: "",
        machine_process: "",
        machine: "",
        part_number: "",
        piece_count: "",
        scrap: ""
    });

    const navigate = useNavigate();
    const [deadTimesRows, setDeadTimesRows] = useState([{ 
        code: "", 
        minutes: "", 
        reason: "",
        reasonId: ""
    }]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!productionData.part_number || !productionData.piece_count) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor complete todos los campos obligatorios',
                timer: 3000
            });
            return;
        }

        const payload = {
            partNumber: productionData.part_number.toString().trim(),
            pieceQuantity: parseInt(productionData.piece_count) || 0,
            scrap: parseInt(productionData.scrap) || 0,
            hourId: parseInt(productionData.time) || 0,
            linesId: parseInt(productionData.line_origin) || 0,
            processId: parseInt(productionData.machine_process) || 0,
            machineId: parseInt(productionData.machine) || 0,
            deadTimes: deadTimesRows
                .filter(row => row.code && !isNaN(row.minutes) && row.minutes > 0)
                .map(row => ({
                    codeId: parseInt(row.code),
                    minutes: parseInt(row.minutes),
                    reasonId: parseInt(row.reasonId)
                }))
        };

        try{

            Swal.fire({
                title: "Registrando...",
                text: "Por favor espere mientras se guarda la información",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(`${config.apiUrl}/ProductionForm/RegisterProduction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });


            const responseText = await response.text();
            const responseData = responseText ? JSON.parse(responseText) : {};

            Swal.close();

            if (!response.ok) {
                const serverError = responseData.errors 
                    ? Object.entries(responseData.errors)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n')
                    : responseData.title || 'Error en el servidor';
                
                throw new Error(serverError);
            }
                
            setProductionData({
                time: "",
                line_origin: "",
                machine_process: "",
                machine: "",
                part_number: "",
                piece_count: "",
                scrap: ""
            });
            
            setDeadTimesRows([{ 
                code: "", 
                minutes: "", 
                reason: "",
                reasonId: ""
            }]);

            Swal.fire({
                icon: "success",
                title: "Exito",
                text: "Registro guardado"
            });
        }catch(error){
            Swal.close();

            console.error("Error completo:", {
                message: error.message,
                stack: error.stack,
                response: error.response
            });

            Swal.fire({
                icon: "error",
                title: "Error en el registro",
                html: `
                    <div class="text-left">
                        <p class="font-semibold">${error.message.split('\n')[0]}</p>
                        ${error.message.includes('\n') ? 
                            `<details class="mt-2 text-sm">
                                <summary>Detalles</summary>
                                <div class="bg-gray-100 p-2 mt-1 rounded">${error.message.split('\n').slice(1).join('<br>')}</div>
                            </details>` : ''
                        }
                        <p class="mt-3 text-sm">Por favor verifique los datos e intente nuevamente.</p>
                    </div>
                `,
                timer: 7000,
                showConfirmButton: true
            });
        }
    };

    const handleNavigate = (path) =>{
        navigate(path);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <form className="max-w-7xl mx-auto" onSubmit={ handleSubmit }>
                    <ProductionHeader/>

                    <div className="flex flex-col lg:flex-row gap-6 mt-6">
                        <div className="w-full lg:w-1/2">
                            <ProductionForm 
                                formData={ productionData }
                                onFormChange={(data) => setProductionData(prev => ({ ...prev, ...data }))}
                            />
                        </div>

                        <div className="w-full lg:w-1/2">
                            <DeadTimesForm
                                rows={ deadTimesRows }
                                setRows={ setDeadTimesRows }
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            type="submit"
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