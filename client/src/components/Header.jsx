export default function Header() {
    return (
        <header className="bg-gradient-to-r from-guinda to-guinda-dark text-white py-6 shadow-xl relative overflow-hidden">
            {/* Greca pattern background */}
            <div className="absolute inset-0 bg-greca-pattern opacity-20"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Mexican Flag Colors */}
                        <div className="flex space-x-1">
                            <div className="w-2 h-12 bg-green-600 rounded"></div>
                            <div className="w-2 h-12 bg-white rounded"></div>
                            <div className="w-2 h-12 bg-red-600 rounded"></div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Trámites Express MX
                            </h1>
                            <p className="text-dorado-light text-sm font-medium">
                                Gestión Rápida y Segura de Trámites
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <svg className="w-5 h-5 text-dorado" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold">Servicio Verificado</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
