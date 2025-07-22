
const DeadTiemsForm = () => {
    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                    Tiempos muertos
                </h2>

                <div className="overflow-auto">                    
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-12"></th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500
                                    uppercase tracking-wider">
                                    Código
                                </th>
                                <th className="w-10 px-4 py-3 text-left text-xs font-medium text-gray-500
                                    uppercase tracking-wider">
                                    Tiempo(mins)
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500
                                    uppercase tracking-wider">
                                    Motivo
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        1
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        2
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        3
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-2 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        4
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        5
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        6
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        7
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        8
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="flex justify-center gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center 
                                        h-6 w-6 rounded-full bg-primary text-white font-medium mr-3 mt-0.5">
                                        9
                                    </span>
                                </td>
                                <td>                                   
                                    <select
                                        className="mt-1 block w-full border border-gray-300 
                                        rounded-md shadow-md py-2 px-3 focus:outline-none
                                        focus:ring-1 focus:ring-primary focus:border-secondary"
                                    >
                                        
                                    </select>
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-secondary"
                                    />
                                </td>
                            </tr>                            
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default DeadTiemsForm