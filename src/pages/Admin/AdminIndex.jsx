import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import config from "../../../config";
import Swal from "sweetalert2";

const AdminIndex = () => {
    const [production, setProduction] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const formateDate = (dateString) => {
        if(!dateString) return "Sin fecha";

        try{
            const date = new Date(dateString);

            return date.toLocaleDateString('es-Es', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                // hour: '2-digit',
                // minute: '2-digit'
            });
        }catch(error){
            console.error("Error al formatear fecha: ", e);
            return "Fecha invalida"
        }
    };

    const handleDownloadExcel = async() => {
        try{
            setDownloading(true);

            Swal.fire({
                title: "Generando reporte",
                html: "Por favor espere mientras se prepara tu archivo...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(`${config.apiUrl}/ProductionForm/DownloadProduction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify()
            });

            if(!response.ok) throw new Error("Error al generar el reporte");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;

            a.download;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);

            Swal.close();

            Swal.fire({
                icon: "success",
                title: "Descarga completa",
                text: "El archivo se ha descargado correctamente",
                timer: 2000,
                showDenyButton: false
            });
        }catch(error){
            console.error("Error al descargar: ", error);
            Swal.fire({
                icon: "error",
                title: "Oooops...",
                text: "Ocurrio un error al descargar el reporte"
            });
        }finally{
            setDownloading(false);
        }
    };

    useEffect(() => {
        const getListProduction = async() => {
            try{
                const response = await fetch(`${config.apiUrl}/ProductionForm/GetListProduction`);

                if(!response.ok) throw new Error("Error al obtener la lista");

                const data = await response.json();
                setProduction(data);
                setError(null);
            }catch(error){
                console.error("Error del servidor");
                setError("No se pudieron cargar los datos. Intente nuevamente");
                setProduction([]);
            }finally{
                setLoading(false);
            }
        };

        getListProduction();
    }, []); 

    const columns = [
        {
            name: 'Fecha',
            selector: row => formateDate(row.registrationDate),
            sortable: true,
        },
        {
            name: 'Línea',
            selector: row => row.line,
            sortable: true,
        },
        {
            name: 'Máquina',
            selector: row => row.machine,
            sortable: true,
        },
        {
            name: 'Hora',
            selector: row => row.hour,
            sortable: true,
        },
        {
            name: 'Producción',
            selector: row => row.pieceQuantity,
            sortable: true,
        },
        {
            name: 'Tiempo muerto',
            selector: row => row.minutes,
            sortable: true,            
        },
        {
            name: 'Scrap',
            selector: row => row.scrap,
            sortable: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#0071ab',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                padding: '12px',
                textAlign: 'center'
            },
        },
        cells: {
            style: {
                textAlign: 'center',
                padding: '12px',
            },
        },
        rows: {
            style: {
                minHeight: '50px',
                '&:nth-child(even)': {
                    backgroundColor: 'rgba(0, 164, 228, 0.05)',
                },
                '&:hover': {
                    backgroundColor: 'rgba(0, 142, 212, 0.1)'
                },
            },
        },
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                            Reporte de producción
                        </h1>
                        <div className="flex space-x-3">
                            <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md 
                                transition-colors hover:cursor-pointer" disabled={ loading } onClick={() => handleDownloadExcel()}>
                                Exportar
                            </button>
                            <button className="bg-tertiary hover:bg-[#005a8c] text-white px-4 py-2 rounded-md
                                transition-colors hover:cursor-pointer" disabled={ loading }>
                                Filtrar
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">                            
                            <div>
                                <input 
                                    type="text"
                                    placeholder="Buscar..."
                                    className="border rounded p-2 text-sm w-full sm:w-64"
                                />
                            </div>
                        </div>

                        {
                            loading ? (
                                <div className="py-12 text-center text-gray-500">
                                    Cargando datos...
                                </div>
                            ) : error ? (
                                <div className="py-12 text-center">
                                    <div className="text-red-500 font-medium mb-2">
                                        { error }
                                    </div>
                                    <button className="bg-primary text-white px-4 py-2 rounded-md
                                        hover:bg-secondary transition-all"
                                        onClick={() => window.location.reload()}
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <DataTable
                                        columns={ columns }
                                        data={ production }
                                        customStyles={ customStyles }
                                        pagination
                                        responsive
                                        highlightOnHover
                                        striped
                                        paginationPerPage={ 10 }
                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                        noDataComponent={<div className="py-8 text-gray-500"> No hay datos disponibles </div>}
                                    />

                                    <div className="mt-6 text-sm text-gray-500">
                                        <p>Mostrando { production.length } de { production.length } registros</p>
                                    </div>
                                </>
                            )
                        }                        
                    </div>                    
                </div>
            </div>
        </>
    )
}

export default AdminIndex