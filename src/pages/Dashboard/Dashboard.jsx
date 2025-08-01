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
    const [totalPieces, setTotalPieces] = useState(0);
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

    const [filters, setFilters] = useState({
        linea: "todas",
        turno: "todos",
        fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
        fechaFin: new Date()
    });

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

    const loadQualityData = async() => {
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

            const response = await fetch(`${config.apiUrl}/ProductionForm/GetQualityData?${params}`);
            const data = await response.json();
        
            const goodPieces = data.goodPieces;
            const scrapPieces = data.scrap;
            const totalPieces = data.totalPieces;

            setQualityData({
                labels: ["Piezas", "Scrap"],
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
                labels: ["Piezas", "Scrap"],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ["#F59E0B", "#F43F5E"],
                    borderWidth: 0
                }]
            });
            setTotalPieces(0);
        }
    };

    useEffect(() => {
        loadQualityData();
    }, [filters]);
    
    const eteGeneralData  = {
        labels: ["Disponibildad", "Eficiencia", "Calidad"],
        datasets: [
            {
                data: [85, 95, 96],
                backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
                borderWidth: 0
            }
        ]
    }

    const disponibilidadData = {
        labels: ["Tiempo operativo", "Tiempo muerto", "Tiempo no planificado"],
        datasets: [
            {
                data: [85, 10, 5],
                backgroundColor: ["#3B82F6", "#F97316", "#F43F5E"],
                borderWidth: 0
            }
        ]
    };

    const rendimientoData = {
        labels: ["Producción real", "Perdida velocidad", "Microparos"],
        datasets: [
            {
                data: [92, 5, 3],
                backgroundColor: ["#10B981", "#F59E0B", "#EC4899"],
                borderWidth: 0
            }
        ]
    };

    const barChartData = {
        labels: ["MTTO CORRECTIVO", "MTTO PREVENTIVO", "COMIDA", "FALTA DE PROGRAMA", "VACACIONES", "RETRABAJO"],
        datasets: [
            {
                label: "Tiempo muerto",
                data: [72, 75, 78, 76, 80, 82, 79],
                backgroundColor: "#3B82F6",
                borderRadius: 6,
            },           
        ]
    };

    const barChartOptions = {
        responsive: true,
        scales: {
        x: {
            grid: {
            display: false,
            },
        },
            y: {
                beginAtZero: false,
                min: 50,
                max: 100,
                title: {
                    display: true,
                    text: 'Porcentaje'
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
                    return `${context.dataset.label}: ${context.raw}%`;
                }
                }
            }
        },
    };

    const donutOptions = {
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

    const currentDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const oeeTotal = Math.round((85 * 92 * 96) / 10000);

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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Líneas
                            </label>
                            <select 
                                id="linea"
                                name="linea"
                                value={ filters.linea }
                                onChange={ handleFilterChange }
                                className="block w-full rounded-lg border 
                                border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 
                                focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="todas">Todas las líneas</option>
                                {
                                    Array.isArray(lines) && lines.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Turno
                            </label>
                            <select 
                                id="turno"
                                name="turno"
                                value={ filters.turno }
                                onChange={ handleFilterChange }
                                className="block w-full rounded-lg border 
                                border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 
                                focus:border-blue-500 focus:ring-blue-500"                           
                            >
                                <option value="">Selecciona un turno</option>
                                {
                                    workShift.map((item) => (
                                        <option key={ item.id } value={ item.id }>
                                            { item.name }
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div>
                            <label htmlFor="fecha" className="mb-1 block text-sm font-medium text-gray-700">
                                Rango de fechas
                            </label>
                            <div className="flex items-center space-x-2">
                                <DatePicker
                                    selected={filters.fechaInicio}
                                    onChange={(date) => setFilters(prev => ({ ...prev, fechaInicio: date }))}
                                    selectsStart
                                    startDate={filters.fechaInicio}
                                    endDate={filters.fechaFin}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="text-gray-500">a</span>
                                <DatePicker
                                    selected={filters.fechaFin}
                                    onChange={(date) => setFilters(prev => ({ ...prev, fechaFin: date }))}
                                    selectsEnd
                                    startDate={filters.fechaInicio}
                                    endDate={filters.fechaFin}
                                    minDate={filters.fechaInicio}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm md:col-span-2 lg:col-span-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">ETE</h2>
                            <div className="flex items-center space-x-2">
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                    { oeeTotal }%
                                </span>
                                <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                                    oeeTotal >= 85 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                    Meta: 85%
                                </span>
                            </div>
                        </div>
                        <div className="h-90 flex justify-center">
                            <Doughnut data={ eteGeneralData } options={ donutOptions }/>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
                            <div>
                                <p>Disponibilidad</p>
                                <p className="font-medium text-blue-600">85%</p>
                            </div>
                            <div>
                                <p>Eficiencia</p>
                                <p className="font-medium text-green-600">92%</p>
                            </div>
                            <div>
                                <p>Calidad</p>
                                <p className="font-medium text-yellow-600">96%</p>
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
                                85%
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={ disponibilidadData } options={ donutOptions }/>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Tiempo total</span>
                            <span className="font-medium">24 hrs</span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Eficiencia
                            </h2>
                            <span className="rounded-full bg-green-100 px-3 py-1 
                                text-sm font-medium text-green-800">
                                92%
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={ rendimientoData } options={ donutOptions }/>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Velocidad ideal</span>
                            <span className="font-medium">100%</span>
                        </div>
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
                                    <p className="text-sm font-medium text-gray-500">Tiempo muerto</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-800">45 min</p>
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
                                    <span className="font-medium text-red-600">+5 min</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Producción perdida</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-800">24 unidades</p>
                                </div>
                                <div className="rounded-full bg-yellow-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-4">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Vs. promedio</span>
                                <span className="font-medium text-yellow-600">+3 unidades</span>
                            </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-100 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Scrap</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-800">12 unidades</p>
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
                                    <span className="font-medium text-green-600">-2 unidades</span>
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
                        <Bar data={ barChartData } options={ barChartOptions } />
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-gray-500">
                        <span>Total tiempo muerto: 290 min</span>
                        <span className="font-medium">Promedio diario: 41.4 min</span>
                    </div>
                </div>          
            </div>
        </>
    )
}

export default Dashboard
