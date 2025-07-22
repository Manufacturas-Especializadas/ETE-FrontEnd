import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJs.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const lineasData = {
        labels: ["Linea 1", "Linea 2", "Linea 3"],
        datasets: [
            {
                data: [300, 200, 150],
                backgroundColor: [
                    "#3B82F6",
                    "#10B981",
                    "#F59E0B"
                ],
                borderWidth: 0
            }
        ]
    };

    const produccionData = {
        labels: ["Completado", "En progreso", "Pendiente"],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: [
                    "#204da5",
                    "#EC4899",
                    "#8B5CF6"
                ],
                borderWidth: 0,
            },
        ],
    };

    const tiempoMuerto = {
        labels: ["Mantenimiento", "Cambio modelo", "Falla equipo"],
        datasets: [
            {
                data: [45, 30, 25],
                backgroundColor: [
                    "#44efa2",
                    "#F97316",
                    "#F43F5E"
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
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
        },
    };

    const currentDate = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <> 
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Dashboard ETE
                        </h1>
                        <p className="text-gray-500">
                            Resumen general del desempeño de producción
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                Fecha
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                { currentDate }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Distribucción por Línea
                            </h2>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                Producción
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={ lineasData } options={ options }/>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Total unidades</span>
                            <span className="font-medium">650</span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Estado de producción
                            </h2>
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                                Progreso
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={ produccionData } options={ options }/>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Total órdenes</span>
                            <span className="font-medium">100</span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Tiempo muerto
                            </h2>
                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                                Eficiencia
                            </span>
                        </div>
                        <div className="h-64 flex justify-center">
                            <Doughnut data={ tiempoMuerto } options={ options }/>
                        </div>
                        <div className="mt-4 flex justify-between text-sm text-gray-500">
                            <span>Total minutos</span>
                            <span className="font-medium">120</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h3 className="mb-2 text-sm font-medium text-gray-500">
                            Scrap diario
                        </h3>
                        <p className="text-2xl font-bold text-gray-800">
                            24 unidades
                        </p>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-yellow-500" style={{ width: "82%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">15% del total producido</p>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h3 className="mb-4 text-sm font-medium text-gray-500">
                            Eficiencia general
                        </h3>
                        <p className="text-2xl font-bold text-gray-800">
                            82%
                        </p>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: "82%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">+2 vs ayer</p>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h3 className="mb-2 text-sm font-medium text-gray-500">Órdenes completadas</h3>
                        <p className="text-2xl font-bold text-gray-800">42/50</p>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-blue-500" style={{ width: "82%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">84% de cumplimiento</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard