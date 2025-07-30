import { useEffect, useState } from "react";
import config from "../../../config";

const DeadTimesForm = ({ rows = [], setRows }) => {
    const [codes, setCodes] = useState([]);
    const [isLoading, setIsLoading] = useState({
        codes: true,
        reasons: false
    });

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/ProductionForm/GetCodes`);
                if (!response.ok) throw new Error("Error al obtener los códigos");
                setCodes(await response.json());
            } catch (error) {
                console.error("Error fetching codes:", error);
            } finally {
                setIsLoading(prev => ({ ...prev, codes: false }));
            }
        };

        fetchCodes();
    }, []);    

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index] = { 
            ...updatedRows[index], 
            [name]: name === 'minutes' ? value : value 
        };
        setRows(updatedRows);
    };

    const handleCodeChange = async (index, e) => {
        const { value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index] = { 
            ...updatedRows[index], 
            code: value,
            reason: "",
            reasonId: ""
        };

        if (value) {
            try {
                setIsLoading(prev => ({ ...prev, reasons: true }));
                const response = await fetch(`${config.apiUrl}/ProductionForm/GetReasonByCodes/${value}`);
                if (!response.ok) throw new Error("Error al obtener motivo");
                
                const data = await response.json();
                const reasonData = Array.isArray(data) ? data[0] : data;
                
                updatedRows[index].reason = reasonData?.name || "";
                updatedRows[index].reasonId = reasonData?.id || "";
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(prev => ({ ...prev, reasons: false }));
                setRows(updatedRows);
            }
        } else {
            setRows(updatedRows);
        }
    };

    const addRow = () => {
        setRows([...rows, { 
            code: "", 
            minutes: "", 
            reason: "",
            reasonId: ""
        }]);
    };

    const removeRow = (index) => {
        if (rows.length <= 1) return;
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Tiempos muertos
                    </h2>
                    <button
                        type="button"
                        onClick={ addRow }
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md 
                        shadow-md transition duration-200 flex items-center gap-2 hover:cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Agregar nuevo código
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-1 py-3 text-left text-xs font-medium 
                                    text-gray-700 uppercase tracking-wider w-12">
                                    
                                </th>
                                <th className="px-1 py-3 text-left text-xs font-medium 
                                    text-gray-700 uppercase tracking-wider min-w-[80px]">
                                    Código
                                </th>
                                <th className="px-1 py-3 text-left text-xs font-medium 
                                    text-gray-700 uppercase tracking-wider min-w-[100px]">
                                    Tiempo (mins)
                                </th>
                                <th className="px-1 py-3 text-left text-xs font-medium 
                                    text-gray-700 uppercase tracking-wider min-w-[250px]">
                                    Motivo
                                </th>
                                <th className="px-1 py-3 text-left text-xs font-medium 
                                    text-gray-700 uppercase tracking-wider w-24">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rows.map((row, index) => (
                                <tr key={ index } className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white font-medium">
                                            { index + 1 }
                                        </span>
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap">
                                        <select
                                            required
                                            name="code"
                                            value={row.code || ""}
                                            onChange={(e) => handleCodeChange(index, e)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm 
                                            focus:ring-primary focus:border-primary transition duration-200
                                            py-2 px-3 text-sm h-[38px]"
                                            disabled={ isLoading.codes }
                                        >
                                            <option value=""></option>
                                            {codes.map((item) => (
                                                <option key={ item.id } value={ item.id }>
                                                    { item.name }
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap">
                                        <input
                                            type="number"
                                            name="minutes"
                                            value={ row.minutes || "" } 
                                            onChange={(e) => handleChange(index, e)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm 
                                            focus:ring-primary focus:border-primary transition duration-200
                                            py-2 px-3 text-sm h-[38px]"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            name="reason"
                                            value={ row.reason || "" }
                                            onChange={(e) => handleChange(index, e)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm 
                                            focus:ring-primary focus:border-primary transition duration-200
                                            py-2 px-3 text-sm h-[38px]"
                                            readOnly
                                        />
                                    </td>
                                    <td className="px-1 py-4 whitespace-nowrap text-center">
                                        {rows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="text-red-500 hover:text-red-700 transition duration-200 hover:cursor-pointer"
                                                title="Eliminar fila"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default DeadTimesForm