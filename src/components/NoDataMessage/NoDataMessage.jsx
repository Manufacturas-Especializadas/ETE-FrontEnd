
const NoDataMessage = ({ message ="No hay datos disponibles para los filtros seleccionados" }) => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <svg 
                    className="w-16 h-16 text-gray-400 mb-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path 
                        strokeLinecap="round" 
                        strokeWidth="2" 
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p className="text-gray-500 font-medium">{ message }</p>
            </div>
        </>
    )
}

export default NoDataMessage
