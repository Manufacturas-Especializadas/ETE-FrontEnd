import { Chart as ChartJs, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { da, es } from "date-fns/locale";
import DatePicker from "react-datepicker";
import config from "../../../config";
import "react-datepicker/dist/react-datepicker.css";

ChartJs.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const [lines, setLines] = useState([]);
    const [workShift, setWorkShift] = useState([]);
    const [machines, setMachines] = useState([]);
    const [eteTotal, setEteTotal] = useState(0);
    const [totalPieces, setTotalPieces] = useState(0);
    const [availabilityPercentage, setAvailabilityPercentage] = useState(85);
    const [qualityData, setQualityData] = useState({
        labels: ["Productos", "Scrap"],
        datasets: [
            {
                data: [95, 5],
                backgroundColor: ["#F59E0B", "#F43F5E"],
                borderWidth: 0
            }
        ]
    });
    const [efficiencyData, setEfficiencyData] = useState({
        labels: ["Eficiencia", "Diferencia"],
        datasets: [
            {
                data: [0, 100],
                backgroundColor: ["#10B981", "#E5E7EB"],
                borderWidth: 0
            }
        ]
    });
    const [availabilityData, setavailabilityData] = useState({
        labels: ["Tiempo disponible", "Tiempo muerto"],
        datasets: [
            {
                data: [85, 15],
                backgroundColor: ["#3B82F6", "#F97316"],
                borderWidth: 0
            }
        ]
    });
    const [eteGeneralData, setEteGeneralData]  = useState({
        labels: ["Disponibildad", "Eficiencia", "Calidad"],
        datasets: [
            {
                data: [85, 95, 96],
                backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                borderWidth: 0
            }
        ]
    });
    const [deadTimeData, setDeadTimeData] = useState({
        labels: [],
        datasets: [
            {
                label: "Tiempo muerto (minutos)",
                data: [],
                backgroundColor: "#3B82F6",
                borderRadius: 6,
            }
        ]
    });
    const [deadTimeStats, setDeadTimeStats] = useState({
        totalMinutes: 0,
        averageMinutes: 0
    });
    const [metrics, setMetrics] = useState({
        deadTime: 0,
        deadTimeVsAvg: 0,
        scrap: 0,
        scrapVsAvg: 0
    });  

    const [stats, setStats] = useState({
        produced: 0,
        expected: 0,
        efficiency: 0,
        hours: 0
    });

    const [filters, setFilters] = useState({
        linea: "todas",       
        turno: "todos",       
        maquina: "todas",     
        fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
        fechaFin: new Date()
    });

    const [tempFilters, setTempFilters] = useState({ ...filters });

    useEffect(() => {
        const getLines = async() => {
            const response = await fetch(`${config.apiUrl}/ProductionForm/GetLines`);

            if(!response.ok) throw new Error("Error al obtener la lista");

            const data = await response.json();
            setLines(data);
        }

        getLines();
    }, []);

    useEffect(() => {
        const getWorkShifts = async() => {
            const response = await fetch(`${config.apiUrl}/ProductionForm/GetWorkShifts`);

            if(!response.ok) throw new Error("Error al obtener la lista");

            const data = await response.json();
            setWorkShift(data);
        };

        getWorkShifts();
    }, []);

    useEffect(() => {
        const getMachine = async() => {
            const response = await fetch(`${config.apiUrl}/ProductionForm/GetMachines`);

            if(!response.ok) throw new Error("Error al obtener la lista");

            const data = await response.json();
            setMachines(data);
        };

        getMachine();
    }, []);

    const applyFilters = () => {
        if (!tempFilters.fechaInicio || !tempFilters.fechaFin) {
            alert("Selecciona un rango de fechas válido");
            return;
        }

        setFilters(tempFilters);
    };

    const cleanFilters = () => {
        const nuevosFiltros = {
            linea: "todas",
            turno: "todos",
            maquina: "todas",
            fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
            fechaFin: new Date(),
        };

        setFilters(nuevosFiltros);
        setTempFilters(nuevosFiltros);
    };


    const loadQualityData = async() => {
        try {
            const params = new URLSearchParams();

            if (filters.linea && filters.linea !== "todas") {
                params.append('lineId', filters.linea);
            }
            
            if (filters.turno && filters.turno !== "todos") {
                params.append('shiftId', filters.turno);
            }
            
            if (filters.maquina && filters.maquina !== "todas") {
                params.append('machineId', filters.maquina);
            }
            
            if (filters.fechaInicio) {
                params.append('startDate', new Date(filters.fechaInicio).toISOString());
            }
            
            if (filters.fechaFin) {
                const endDate = new Date(filters.fechaFin);
                endDate.setHours(23, 59, 59, 999);
                params.append('endDate', endDate.toISOString());
            }

            const response = await fetch(`${config.apiUrl}/ProductionForm/GetQualityData?${params}`);
            const data = await response.json();
        
            const goodPieces = data.goodPieces || 0;
            const scrapPieces = data.scrap || 0;
            const totalPieces = data.totalPieces || 0;

            setQualityData({
                labels: ["Piezas buenas", "Scrap"],
                datasets: [{
                    data: [goodPieces, scrapPieces],
                    backgroundColor: ["#F59E0B", "#F43F5E"],
                    borderWidth: 0
                }]
            });
            
            setTotalPieces(totalPieces);
        } catch(error) {
            console.error("Error loading quality data: ", error);
            setQualityData({
                labels: ["Piezas buenas", "Scrap"],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ["#F59E0B", "#F43F5E"],
                    borderWidth: 0
                }]
            });
            setTotalPieces(0);
        }
    };

    const loadEfficiencyData = async () => {
        try {
            const params = new URLSearchParams();

            if (filters.linea && filters.linea !== "todas") {
                params.append('lineId', filters.linea);
            }
            
            if (filters.turno && filters.turno !== "todos") {
                params.append('shiftId', filters.turno);
            }
            
            if (filters.fechaInicio) {
                params.append('startDate', new Date(filters.fechaInicio).toISOString());
            }
            
            if (filters.fechaFin) {
                const endDate = new Date(filters.fechaFin);
                endDate.setHours(23, 59, 59, 999);
                params.append('endDate', endDate.toISOString());
            }

            const response = await fetch(`${config.apiUrl}/ProductionForm/GetEfficiencyData?${params.toString()}`);
            const data = await response.json();

            const summaryItem = data.summary && data.summary.length > 0 ? data.summary[0] : {
                totalProduced: 0,
                totalExpected: 1,
                efficiency: 0
            };

            const efficiencyPercentage = Math.round(summaryItem.efficiency * 100);
            const remaining = 100 - efficiencyPercentage;

            setEfficiencyData({
                labels: ["Eficiencia", "Diferencia"],
                datasets: [{
                    data: [efficiencyPercentage, remaining > 0 ? remaining : 0],
                    backgroundColor: ["#10B981", "#E5E7EB"],
                    borderWidth: 0
                }]
            });

            setStats({
                produced: summaryItem.totalProduced,
                expected: Math.round(summaryItem.totalExpected),
                efficiency: efficiencyPercentage,
                hours: 1
            });
        } catch(error) {
            console.error("Error loading efficiency data: ", error);
        }
    };

    const loadAvailabilityData = async() => {
        try {
            const params = new URLSearchParams();

            if (filters.linea && filters.linea !== "todas") { 
                params.append('lineId', filters.linea);
            }

            if (filters.maquina && filters.maquina !== "todas") { 
                params.append('machineId', filters.maquina);
            }

            if (filters.turno && filters.turno !== "todos") {
                params.append('shiftId', filters.turno);
            }

            if (filters.fechaInicio) {
                params.append('startDate', new Date(filters.fechaInicio).toISOString());
            }
            
            const response = await fetch(`${config.apiUrl}/ProductionForm/GetAvailabilityData?${params}`);
            const data = await response.json();

            const availableTime = Number(data.availableTime) || 0;
            const totalTime = Number(data.totalTime) || 0;

            let availablePercent = 0;
            let deadPercent = 0;

            if (totalTime > 0) {
                availablePercent = Math.round((availableTime / totalTime) * 100);
                deadPercent = 100 - availablePercent;
            }

            if (availablePercent < 0 || availablePercent > 100) availablePercent = 0;
            if (deadPercent < 0 || deadPercent > 100) deadPercent = 0;

            setavailabilityData({
                labels: ["Tiempo disponible", "Tiempo muerto"],
                datasets: [{
                    data: [availablePercent, deadPercent],
                    backgroundColor: ["#3B82F6", "#F97316"],
                    borderWidth: 0
                }]
            });

            setAvailabilityPercentage(data.percentage || availablePercent);
        } catch (error) {
            console.error("Error loading availability data", error);
            setavailabilityData({
                labels: ["Tiempo disponible", "Tiempo muerto"],
                datasets: [{
                    data: [85, 15],
                    backgroundColor: ["#3B82F6", "#F97316"],
                    borderWidth: 0
                }]
            });
            setAvailabilityPercentage(85);
        }
    };


    const loadDeadTimeData = async() => {
        try {
            const params = new URLSearchParams();
            
            if (filters.linea && filters.linea !== "todas") {
                params.append('lineId', filters.linea);
            }
            
            if (filters.turno && filters.turno !== "todos") {
                params.append('shiftId', filters.turno);
            }
            
            if (filters.fechaInicio) {
                params.append('startDate', new Date(filters.fechaInicio).toISOString());
            }
            
            if (filters.fechaFin) {
                const endDate = new Date(filters.fechaFin);
                endDate.setHours(23, 59, 59, 999);
                params.append('endDate', endDate.toISOString());
            }

            const response = await fetch(`${config.apiUrl}/ProductionForm/GetDeadTimeByReasonLast6Days?${params}`);
            const data = await response.json();

            setDeadTimeData({
                labels: data.labels,
                datasets: [{
                    label: "Tiempo muerto (minutos)",
                    data: data.data,
                    backgroundColor: "#3B82F6",
                    borderRadius: 6,
                }]
            });

            setDeadTimeStats({
                totalMinutes: data.totalMinutes,
                averageMinutes: data.averageMinutes.toFixed(1)
            });
        } catch(error) {
            console.error("Error loading dead time data: ", error);
            setDeadTimeData({
                labels: [],
                datasets: [{
                    label: "Tiempo muerto (minutos)",
                    data: [],
                    backgroundColor: "#3B82F6",
                    borderRadius: 6,
                }]
            });
            setDeadTimeStats({
                totalMinutes: 0,
                averageMinutes: 0
            });
        }
    };

    const loadOeeData = async () => {
        try {
            const params = new URLSearchParams();

            if(filters.linea && filters.linea !== "todas"){
                params.append('lineId', filters.linea);
            }

            if(filters.turno && filters.turno !== "todos"){
                params.append("shiftId", filters.turno);
            }

            if(filters.fechaInicio){
                params.append("startDate", new Date(filters.fechaInicio).toISOString());
            }

            if(filters.fechaFin){
                const endDate = new Date(filters.fechaFin);
                endDate.setHours(23, 59, 59, 999);
                params.append("endDate", endDate.toISOString());
            }

            if(filters.maquina && filters.maquina !== "todas"){
                params.append("machineId", filters.maquina);
            }

            const [qualityRes, efficiencyRes, availabilityRes] = await Promise.all([
                fetch(`${config.apiUrl}/ProductionForm/GetQualityData?${params.toString()}`),
                fetch(`${config.apiUrl}/ProductionForm/GetEfficiencyData?${params.toString()}`),
                fetch(`${config.apiUrl}/ProductionForm/GetAvailabilityData?${params.toString()}`)
            ]);

            const qualityData = await qualityRes.json();
            const efficiencyData = await efficiencyRes.json();
            const availabilityData = await availabilityRes.json();

            const quality = qualityData.qualityPercentage || 0;
            const efficiency = efficiencyData.summary?.length > 0 ?
                Math.round(efficiencyData.summary[0].efficiency * 100) : 0;
            const availability = availabilityData.percentage || 0;

            const calculatedOee = Math.round((availability / 100) * (efficiency / 100) * (quality / 100) * 100);

            setEteTotal(calculatedOee);
            setEteGeneralData({
                labels: ["Disponibilidad", "Eficiencia", "Calidad"],
                datasets: [{
                    data: [availability, efficiency, quality],
                    backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderWidth: 0
                }]
            });

        } catch(error) {
            console.error("Error loading OEE data: ", error);
            setEteTotal(0);
            setEteGeneralData({
                labels: ["Disponibilidad", "Eficiencia", "Calidad"],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                    borderWidth: 0
                }]
            });
        }
    };

    const loadMetrics = async() => {
        try{
            const params = new URLSearchParams();

            if (filters.linea && filters.linea !== "todas") {
                params.append('lineId', filters.linea);
            }
            
            if (filters.fechaInicio) {
                params.append('startDate', new Date(filters.fechaInicio).toISOString());
            }
            
            if (filters.fechaFin) {
                const endDate = new Date(filters.fechaFin);
                endDate.setHours(23, 59, 59, 999);
                params.append('endDate', endDate.toISOString());
            }

            const response = await fetch(`${config.apiUrl}/ProductionForm/GetKeyMetrics?${params}`);
            const data = await response.json();

            setMetrics({
                deadTime: data.deadTime,
                deadTimeVsAvg: data.deadTimeVsAvg,
                scrap: data.scrap,
                scrapVsAvg: data.scrapVsAvg
            });
        }catch(error){
            console.error("Error loading metrics: ", error);
        }
    };

    useEffect(() => {
        const filtrosValidos = filters.fechaInicio && filters.fechaFin;

        if (!filtrosValidos) return;

        const loadAllData = async () => {
            try {
                await Promise.all([
                    loadQualityData(),
                    loadEfficiencyData(),
                    loadAvailabilityData(),
                    loadOeeData(),
                    loadDeadTimeData(),
                    loadMetrics()
                ]);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        loadAllData();
    }, [filters]);

    const barChartDeadTimes = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Minutos'
                },
                grid: {
                    color: "#E5E7EB",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.raw} min`;
                    }
                }
            }
        },
    };

    const donutQaulityOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const dounutEfficiencyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        },
        cutout: '70%'
    };

    const donutAvailabilityOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 12,
                    padding: 20,
                    font: {
                        family: "Inter, sans-serif",
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            },
        },
    };

    const currentDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

    return (
        <> 
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard ETE</h1>
                        <p className="text-gray-500">Eficiencia general de equipos - Análisis completo</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">Fecha</p>
                            <p className="text-lg font-semibold text-gray-800">{ currentDate }</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Filtros</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Líneas
                            </label>
                            <select 
                                id="linea"
                                name="linea"
                                value={ tempFilters.linea }
                                onChange={(e) => setTempFilters(prev => ({ ...prev, linea: e.target.value }))}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="todas">Todas las líneas</option>
                                {Array.isArray(lines) && lines.map((item) => (
                                    <option key={ item.id } value={ item.id }>
                                        { item.name }
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Máquina
                            </label>
                            <select
                                id="maquina"
                                name="maquina"
                                value={ tempFilters.maquina }
                                onChange={(e) => setTempFilters(prev => ({ ...prev, maquina: e.target.value }))}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="todas">Todas las máquinas</option>
                                {machines.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Turno
                            </label>
                            <select 
                                id="turno"
                                name="turno"
                                value={ tempFilters.turno }
                                onChange={(e) => setTempFilters(prev => ({ ...prev, turno: e.target.value }))}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Selecciona un turno</option>
                                {workShift.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="fecha" className="mb-1 block text-sm font-medium text-gray-700">
                                Rango de fechas
                            </label>
                            <div className="flex items-center space-x-2">
                                <DatePicker
                                    selected={tempFilters.fechaInicio}
                                    onChange={(date) => setTempFilters(prev => ({ ...prev, fechaInicio: date }))}
                                    selectsStart
                                    startDate={tempFilters.fechaInicio}
                                    endDate={tempFilters.fechaFin}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-500">a</span>
                                <DatePicker
                                    selected={tempFilters.fechaFin}
                                    onChange={(date) => setTempFilters(prev => ({ ...prev, fechaFin: date }))}
                                    selectsEnd
                                    startDate={tempFilters.fechaInicio}
                                    endDate={tempFilters.fechaFin}
                                    minDate={tempFilters.fechaInicio}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-5">
                        <button
                            onClick={ cleanFilters }
                            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 hover:cursor-pointer"
                        >
                            Limpiar filtros
                        </button>
                        <button
                            onClick={ applyFilters }
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 hover:cursor-pointer"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm md:col-span-2 lg:col-span-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">ETE</h2>
                            <div className="flex items-center space-x-2">
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                    { eteTotal }%
                                </span>
                                <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    eteTotal >= 85 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                    Meta: 85%
                                </span>
                            </div>
                        </div>
                        <div className="h-90 flex justify-center">
                            <Doughnut data={ eteGeneralData } options={ donutAvailabilityOptions } />
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
                            <div>
                                <p>Disponibilidad</p>
                                <p className="font-medium text-blue-600">
                                    { eteGeneralData.datasets[0].data[0] }%
                                </p>
                            </div>
                            <div>
                                <p>Eficiencia</p>
                                <p className="font-medium text-green-600">
                                    { eteGeneralData.datasets[0].data[1] }%
                                </p>
                            </div>
                            <div>
                                <p>Calidad</p>
                                <p className="font-medium text-yellow-600">
                                    { eteGeneralData.datasets[0].data[2] }%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Disponibilidad
                            </h2>
                            <span className="rounded-full bg-blue-100 px-3 py-1 
                                text-sm font-medium text-blue-800">
                                { availabilityPercentage }%
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            {availabilityData && availabilityData.datasets ? (
                                <Doughnut data={ availabilityData } options={ donutAvailabilityOptions } />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span>Cargando datos...</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Tiempo muerto total</span>
                            <span className="font-medium">
                                {availabilityData.datasets?.[0]?.data?.[1] ? 
                                    `${Math.round((availabilityData.datasets[0].data[1] / 100) * 1440)} mins` : 
                                    '0 mins'}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Eficiencia
                            </h2>
                            <span className="rounded-full bg-green-100 px-3 py-1 
                                text-sm font-medium text-green-800">
                                { stats.efficiency }%
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={ efficiencyData } options={ dounutEfficiencyOptions }/>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Velocidad ideal</span>
                            <span className="font-medium">100%</span>
                        </div>
                        {/* <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-gray-50 p-3">
                                <p className="text-sm text-gray-500">Piezas producidas</p>
                                <p className="text-lg font-semibold">{ stats.produced }</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                                <p className="text-sm text-gray-500">Piezas esperadas</p>
                                <p className="text-lg font-semibold">{ stats.expected }</p>
                            </div>
                        </div> */}
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Calidad
                            </h2>
                            <span className="rounded-full bg-yellow-100 px-3 py-1 
                                text-sm font-medium text-yellow-800">
                                {qualityData.datasets[0].data[0] > 0 ? 
                                    Math.round((qualityData.datasets[0].data[0] / 
                                    (qualityData.datasets[0].data[0] + qualityData.datasets[0].data[1])) * 100) + '%' : '0%'}
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={ qualityData } options={ donutQaulityOptions } />
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Total producido</span>
                            <span className="font-medium">{totalPieces} unidades</span>
                        </div>
                    </div>
                </div>
                
                <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800">Métricas Clave</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Tiempo muerto
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-gray-800">
                                        { metrics.deadTime } min
                                    </p>
                                </div>
                                <div className="rounded-full bg-red-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Vs. promedio</span>
                                    <span className="font-medium text-red-600">
                                        { metrics.deadTimeVsAvg >= 0 ? '+' : '' } { metrics.deadTimeVsAvg.toFixed(1) } min
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Producción perdida</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-800">
                                        { Math.round(stats.expected - stats.produced) } unidades
                                    </p>
                                </div>
                                <div className="rounded-full bg-yellow-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Eficiencia alcanzada</span>
                                    <span className="font-medium text-yellow-600">
                                        { stats.efficiency }%
                                    </span>
                                </div>
                            </div>
                    </div>

                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Scrap
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-gray-800">
                                        { metrics.scrap } unidades
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Vs. promedio</span>
                                    <span className="font-medium text-green-600">
                                        { metrics.scrapVsAvg >= 0 ? '+' : '' } { metrics.scrapVsAvg.toFixed(1) } unidades
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Tiempo Muerto</h2>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                            Últimos 6 días
                        </span>
                    </div>
                    <div className="h-80 flex justify-center">
                        <Bar data={ deadTimeData } options={ barChartDeadTimes } />
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-gray-500">
                        <span>Total tiempo muerto: { deadTimeStats.totalMinutes } min</span>
                        <span className="font-medium">Promedio diario: { deadTimeStats.averageMinutes } min</span>
                    </div>
                </div>   
            </div>
        </>
    )
}

export default Dashboard