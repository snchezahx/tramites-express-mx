export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-20 relative overflow-hidden">
            {/* Talavera pattern background */}
            <div className="absolute inset-0 bg-talavera-pattern opacity-10"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center">
                            <div className="flex space-x-1 mr-3">
                                <div className="w-1.5 h-8 bg-green-600 rounded"></div>
                                <div className="w-1.5 h-8 bg-white rounded"></div>
                                <div className="w-1.5 h-8 bg-red-600 rounded"></div>
                            </div>
                            Trámites Express MX
                        </h3>
                        <p className="text-sm text-gray-400">
                            Facilitamos la gestión de tus trámites gubernamentales de manera rápida, segura y confiable.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Servicios</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Actas de Nacimiento</li>
                            <li>RFC y NSS</li>
                            <li>Antecedentes No Penales</li>
                            <li>Buró de Crédito</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <p className="text-sm mb-2">
                            <span className="text-dorado">📞</span> Atención al cliente
                        </p>
                        <p className="text-sm text-gray-400">
                            Horario: Lunes a Viernes<br />
                            9:00 AM - 6:00 PM
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                        <p className="text-gray-400 mb-4 md:mb-0">
                            &copy; 2024 Trámites Express MX. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                            <span className="text-yellow-500">⚠️</span> No hay cancelaciones. Pago por trámite.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
