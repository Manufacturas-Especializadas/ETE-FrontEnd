import { useEffect, useRef, useState } from "react";
import config from "../../../config";
import debounce from "lodash.debounce";

const ProductionForm = ({ formData, onFormChange }) => {
    const [times, setTimes] = useState([]);
    const [lines, setLines] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [machines, setMachines] = useState([]);
    const [partDisplayValue, setPartDisplayValue] = useState(formData.part_number || '');
    const [isLoading, setIsLoading] = useState({
        lines: false,
        processes: false,
        machines: false
    });
    const [partValidation, setPartValidation] = useState({
        isValid: null,
        isLoading: false,
        error: null
    });

    const validatePartRef = useRef();

    useEffect(() => {
        const validatePart = async (partNumber) => {

            if (!partNumber.trim()) {
                setPartValidation({ isValid: null, isLoading: false, error: null });
                return;
            }

            setPartValidation(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const response = await fetch(
                    `${config.apiUrl}/ProductionForm/ValidatePartNumber/${encodeURIComponent(partNumber.trim())}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setPartValidation({
                    isValid: data.exists,
                    isLoading: false,
                    error: null
                });
            } catch (err) {
                setPartValidation({
                    isValid: null,
                    isLoading: false,
                    error: err.message
                });
            }
        };

        validatePartRef.current = debounce(validatePart, 500);

        return () => {
            validatePartRef.current?.cancel();
        };
    }, []);

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

    const handlePartNumberChange = (e) => {
        const displayValue = e.target.value;
        setPartDisplayValue(displayValue);

        const normalizedValue = displayValue.trim().toUpperCase();

        onFormChange({ part_number: normalizedValue });

        setPartValidation({ isValid: null, isLoading: false, error: null });

        if (validatePartRef.current) {
            validatePartRef.current(normalizedValue);
        }
    };

    useEffect(() => {
        if (formData.part_number !== partDisplayValue.toUpperCase().trim()) {
            setPartDisplayValue(formData.part_number || '');
        }
    }, [formData.part_number]);

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
                            Número de parte
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="part_number"
                                onChange={handlePartNumberChange}
                                value={partDisplayValue}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${partValidation.isValid === true
                                    ? "border-green-500 focus:border-green-500"
                                    : partValidation.isValid === false
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-300"
                                    }`}
                            />
                            {
                                partValidation.isLoading && (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                                    </div>
                                )
                            }

                            {
                                !partValidation.isLoading && partValidation.isValid !== null && (
                                    <div className="absolute right-3 top-2.5">
                                        {
                                            partValidation.isValid ? (
                                                <span className="text-green-500 text-lg">✓</span>
                                            ) : (
                                                <span className="text-red-500 text-lg">✗</span>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                        {
                            partValidation.isValid === false && (
                                <p className="mt-1 text-sm text-red-600">Número de parte no válido</p>
                            )
                        }

                        {
                            partValidation.error && (
                                <p className="mt-1 text-sm text-yellow-600">Error al validar: {partValidation.error}</p>
                            )
                        }
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