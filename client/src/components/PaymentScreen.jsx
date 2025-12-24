import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function PaymentScreen({ service, formData, onBack }) {
    const [order, setOrder] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const orderCreated = useRef(false); // Prevent duplicate creation

    // Create order when component mounts
    useEffect(() => {
        // Prevent duplicate creation in React strict mode
        if (orderCreated.current) return;

        orderCreated.current = true;
        createOrder();
    }, []);

    const createOrder = async () => {
        try {
            const response = await axios.post('/api/orders/create', {
                serviceType: service.name,
                servicePrice: service.price,
                curp: formData.curp,
                phoneNumber: formData.phoneNumber
            });

            setOrder(response.data.order);
        } catch (err) {
            setError('Error al crear la orden. Por favor intenta nuevamente.');
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                setError('Solo se permiten imágenes (JPG, PNG) o PDF');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('El archivo no debe superar 5MB');
                return;
            }

            setReceiptFile(file);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!receiptFile || !order) {
            setError('Por favor selecciona un archivo');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('receipt', receiptFile);

            await axios.post(`/api/orders/upload-receipt/${order.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSubmitted(true);
        } catch (err) {
            setError('Error al subir el comprobante. Por favor intenta nuevamente.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-12 animate-fade-in">
                <div className="glass rounded-xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¡Solicitud Recibida!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Tu comprobante ha sido enviado exitosamente. Procesaremos tu trámite una vez verificado el pago.
                    </p>
                    <div className="bg-guinda/10 border-2 border-guinda rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Número de Referencia:</strong>
                        </p>
                        <p className="text-2xl font-bold text-guinda">
                            {order?.referenceNumber}
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mb-8">
                        Guarda este número para futuras consultas
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Realizar Otro Trámite
                    </button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Generando información de pago...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 animate-fade-in">
            <button
                onClick={onBack}
                className="flex items-center text-guinda hover:text-guinda-dark mb-6 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al formulario
            </button>

            <div className="glass rounded-xl p-8 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Información de <span className="text-guinda">Pago</span>
                </h2>

                {/* Service Summary */}
                <div className="bg-gradient-to-br from-guinda to-guinda-dark text-white rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-dorado-light text-sm mb-1">Trámite</p>
                            <p className="text-xl font-bold">{service.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-dorado-light text-sm mb-1">Monto Total</p>
                            <p className="text-3xl font-bold">${service.price} MXN</p>
                        </div>
                    </div>
                    <div className="border-t border-white/20 pt-4">
                        <p className="text-sm text-white/90">
                            <strong>CURP:</strong> {formData.curp}
                        </p>
                        <p className="text-sm text-white/90">
                            <strong>Teléfono:</strong> {formData.phoneNumber}
                        </p>
                    </div>
                </div>

                {/* Payment Instructions */}
                <div className="space-y-4 mb-6">
                    <h3 className="font-bold text-lg text-gray-900">
                        Instrucciones de Pago
                    </h3>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-blue-900 font-semibold mb-2">
                            Realiza tu transferencia bancaria a:
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-blue-800">
                                <strong>Banco:</strong> BBVA México
                            </p>
                            <p className="text-sm text-blue-800">
                                <strong>Cuenta:</strong> 1234 5678 9012 3456
                            </p>
                            <p className="text-sm text-blue-800">
                                <strong>CLABE:</strong> 012180001234567890
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <p className="text-sm text-yellow-900 font-semibold mb-2">
                            📌 Número de Referencia (IMPORTANTE)
                        </p>
                        <p className="text-2xl font-bold text-yellow-900 font-mono">
                            {order.referenceNumber}
                        </p>
                        <p className="text-xs text-yellow-800 mt-2">
                            Incluye este número en la descripción de tu transferencia
                        </p>
                    </div>
                </div>

                {/* Warnings */}
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-bold text-red-900">Importante:</p>
                            <ul className="text-sm text-red-800 list-disc list-inside mt-1">
                                <li>No hay cancelaciones una vez realizado el pago</li>
                                <li>El pago es por trámite individual</li>
                                <li>Conserva tu comprobante de pago</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Upload Receipt */}
                <div className="border-t pt-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">
                        Subir Comprobante de Pago
                    </h3>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Comprobante (Imagen o PDF)
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,application/pdf"
                            onChange={handleFileChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-guinda outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Formatos permitidos: JPG, PNG, PDF (máximo 5MB)
                        </p>
                    </div>

                    {receiptFile && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-green-800">
                                ✓ Archivo seleccionado: {receiptFile.name}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!receiptFile || uploading}
                        className={`w-full btn-primary ${(!receiptFile || uploading) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center">
                                <div className="spinner mr-2"></div>
                                Subiendo...
                            </span>
                        ) : (
                            'Enviar Comprobante'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
