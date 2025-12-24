const services = [
    {
        id: 1,
        name: 'Actas de Nacimiento',
        price: 50,
        icon: '📄',
        description: 'Obtén tu acta de nacimiento oficial'
    },
    {
        id: 2,
        name: 'RFC',
        price: 150,
        icon: '🏛️',
        description: 'Registro Federal de Contribuyentes'
    },
    {
        id: 3,
        name: 'NSS',
        price: 30,
        icon: '🔢',
        description: 'Número de Seguridad Social'
    },
    {
        id: 4,
        name: 'Semanas Cotizadas',
        price: 30,
        icon: '📊',
        description: 'Consulta tus semanas cotizadas'
    },
    {
        id: 5,
        name: 'Vigencia de Derechos',
        price: 30,
        icon: '✅',
        description: 'Verifica tu vigencia de derechos'
    },
    {
        id: 6,
        name: 'Antecedentes No Penales',
        price: 100,
        icon: '🛡️',
        description: 'Carta de antecedentes no penales'
    },
    {
        id: 7,
        name: 'Buró de Crédito',
        price: 150,
        icon: '💳',
        description: 'Reporte de buró de crédito'
    }
];

export default function ServiceSelector({ onSelectService }) {
    return (
        <div className="py-12 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Selecciona tu <span className="text-guinda">Trámite</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Elige el servicio que necesitas y completa tu solicitud en minutos
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="service-card p-6 hover:border-guinda"
                        onClick={() => onSelectService(service)}
                    >
                        <div className="text-5xl mb-4 text-center">{service.icon}</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                            {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 text-center min-h-[40px]">
                            {service.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-guinda">
                                ${service.price}
                            </span>
                            <button className="bg-guinda hover:bg-guinda-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105">
                                Solicitar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
