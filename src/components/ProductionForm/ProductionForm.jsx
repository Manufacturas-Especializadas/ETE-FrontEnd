import { useEffect, useState } from "react";
import config from "../../../config";

const ProductionForm = ({ formData, onFormChange }) => {
    const [times, setTimes] = useState([]);
    const [lines, setLines] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [machines, setMachines] = useState([]);
    const [isLoading, setIsLoading] = useState({
        lines: false,
        processes: false,
        machines: false
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const timesResponse = await fetch(`${config.apiUrl}/ProductionForm/GetListTimes`);

                if (!timesResponse.ok) throw new Error("Error al obtener horas");
                const timesData = await timesResponse.json();
                setTimes(timesData);

                setIsLoading(prev => ({ ...prev, lines: true }));
                const linesResponse = await fetch(`${config.apiUrl}/ProductionForm/GetLines`);
                if (!linesResponse.ok) throw new Error("Error al obtener lineas");
                const linesData = await linesResponse.json();
                setLines(linesData);
            } catch (error) {
                console.error("Error: ", error);
            } finally {
                setIsLoading(prev => ({ ...prev, lines: false }));
            }
        };
        fetchInitialData();

    }, []);

    useEffect(() => {
        if (formData.line_origin) {
            const fetchProcesses = async () => {
                try {
                    setIsLoading(prev => ({ ...prev, processes: true }));
                    setProcesses([]);
                    onFormChange({ machine_process: "", machine: "" });

                    const response = await fetch(`${config.apiUrl}/ProductionForm/GetProcessesByLine/${formData.line_origin}`);
                    if (!response.ok) throw new Error("Error al obtener procesos");
                    const data = await response.json();
                    setProcesses(data);
                } catch (error) {
                    console.error("Error", error);
                } finally {
                    setIsLoading(prev => ({ ...prev, processes: false }));
                }
            };

            fetchProcesses();
        } else {
            setProcesses([]);
            onFormChange({ machine_process: "", machine: "" });
        }
    }, [formData.line_origin]);

    useEffect(() => {
        if (formData.machine_process) {
            const fetchMachines = async () => {
                try {
                    setIsLoading(prev => ({ ...prev, machines: true }));
                    setMachines([]);
                    onFormChange({ machine: "" });

                    const response = await fetch(`${config.apiUrl}/ProductionForm/GetMachinesByProcess/${formData.machine_process}`);
                    if (!response.ok) throw new Error("Error al obtener maquinas");
                    const data = await response.json();
                    setMachines(data);
                } catch (error) {
                    console.error("Error: ", error);
                } finally {
                    setIsLoading(prev => ({ ...prev, machines: false }));
                }
            };

            fetchMachines();
        } else {
            setMachines([]);
            onFormChange({ machine: "" });
        }
    }, [formData.machine_process]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormChange({ [name]: value });
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Producción</h2>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600">
                            Horas
                        </label>
                        <select
                            required
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 
                            rounded-md shadow-md py-2 px-3 focus:outline-none
                            focus:ring-2 focus:ring-primary focus:border-secondary"
                        >
                            <option value="" disabled>Selecciona</option>
                            {
                                times.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.time}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600">
                            Línea Origen
                        </label>
                        <select
                            required
                            name="line_origin"
                            value={formData.line_origin}
                            onChange={handleChange}
                            disabled={isLoading.lines}
                            className="mt-1 block w-full border border-gray-300 
                            rounded-md shadow-md py-2 px-3 focus:outline-none
                            focus:ring-2 focus:ring-primary focus:border-secondary"
                        >
                            <option value="" disabled>Selecciona</option>
                            {
                                lines.map((line => (
                                    <option key={line.id} value={line.id}>
                                        {line.name}
                                    </option>
                                )))
                            }
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600">
                            Proceso
                        </label>
                        <select
                            required
                            name="machine_process"
                            className="mt-1 block w-full border border-gray-300 
                            rounded-md shadow-md py-2 px-3 focus:outline-none
                            focus:ring-2 focus:ring-primary focus:border-secondary"
                            value={formData.machine_process}
                            onChange={handleChange}
                            disabled={!formData.line_origin || isLoading.processes}
                        >
                            <option value="">Selecciona</option>
                            {
                                processes.map(process => (
                                    <option key={process.id} value={process.id}>
                                        {process.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600">
                            Máquina
                        </label>
                        <select
                            required
                            name="machine"
                            className="mt-1 block w-full border border-gray-300 
                                rounded-md shadow-md py-2 px-3 focus:outline-none
                                focus:ring-2 focus:ring-primary focus:border-secondary"
                            value={formData.machine}
                            onChange={handleChange}
                            disabled={!formData.machine_process || isLoading.machines}
                        >
                            <option value="">Selecciona</option>
                            {
                                machines.map(machine => (
                                    <option key={machine.id} value={machine.id}>
                                        {machine.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600">
                            Número Parte
                        </label>
                        <input
                            type="text"
                            name="part_number"
                            onChange={handleChange}
                            value={formData.part_number}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600">
                                    Cantidad Piezas
                                </label>
                                <input
                                    required
                                    type="number"
                                    name="piece_count"
                                    onChange={handleChange}
                                    value={formData.piece_count}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    min="0"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600">
                                    Scrap
                                </label>
                                <input
                                    type="number"
                                    name="scrap"
                                    onChange={handleChange}
                                    value={formData.scrap}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600">
                            Fecha
                        </label>
                        <input
                            type="date"
                            name="manualDate"
                            onChange={handleChange}
                            value={formData.manualDate}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductionForm