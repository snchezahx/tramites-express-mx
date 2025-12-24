const reviews = [
    {
        id: 1,
        name: 'María González',
        rating: 5,
        comment: 'Excelente servicio, recibí mi acta de nacimiento en tiempo récord. Muy profesionales.',
        date: '15 de Dic, 2024'
    },
    {
        id: 2,
        name: 'Carlos Hernández',
        rating: 5,
        comment: 'Trámite de RFC muy rápido y sin complicaciones. Totalmente recomendado.',
        date: '10 de Dic, 2024'
    },
    {
        id: 3,
        name: 'Ana Martínez',
        rating: 5,
        comment: 'El proceso fue muy sencillo y transparente. Obtuve mis antecedentes no penales sin problema.',
        date: '5 de Dic, 2024'
    },
    {
        id: 4,
        name: 'Roberto Sánchez',
        rating: 4,
        comment: 'Buen servicio, lo único es que tardó un poco más de lo esperado pero al final todo bien.',
        date: '1 de Dic, 2024'
    },
    {
        id: 5,
        name: 'Laura Ramírez',
        rating: 5,
        comment: 'Muy confiable. Procesaron mi NSS rápidamente y con toda la documentación en orden.',
        date: '28 de Nov, 2024'
    },
    {
        id: 6,
        name: 'José Luis Torres',
        rating: 5,
        comment: 'Increíble servicio. Me ahorraron mucho tiempo y estrés con mi trámite del buró de crédito.',
        date: '25 de Nov, 2024'
    }
];

function StarRating({ rating }) {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function Reviews() {
    return (
        <div className="py-16 bg-gray-50 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-talavera-pattern opacity-5"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        Lo que dicen nuestros <span className="text-guinda">Clientes</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Miles de mexicanos han confiado en nosotros para sus trámites gubernamentales
                    </p>
                    <div className="flex items-center justify-center mt-4 space-x-2">
                        <StarRating rating={5} />
                        <span className="text-gray-700 font-semibold">4.8 de 5.0</span>
                        <span className="text-gray-500">(+2,500 reseñas)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-guinda to-guinda-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{review.name}</p>
                                        <p className="text-xs text-gray-500">{review.date}</p>
                                    </div>
                                </div>
                            </div>

                            <StarRating rating={review.rating} />

                            <p className="text-gray-700 mt-4 text-sm leading-relaxed">
                                "{review.comment}"
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs text-gray-500">
                                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Cliente Verificado
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-6 text-center shadow-md">
                        <div className="text-4xl font-bold text-guinda mb-2">+5,000</div>
                        <p className="text-gray-600 font-semibold">Trámites Procesados</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 text-center shadow-md">
                        <div className="text-4xl font-bold text-guinda mb-2">98%</div>
                        <p className="text-gray-600 font-semibold">Satisfacción del Cliente</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 text-center shadow-md">
                        <div className="text-4xl font-bold text-guinda mb-2">3h</div>
                        <p className="text-gray-600 font-semibold">Tiempo de Entrega</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
