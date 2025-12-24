import { useState } from 'react';
import axios from 'axios';

export default function ServiceForm({ service, onSubmit, onBack }) {
    const [curp, setCurp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [curpValidation, setCurpValidation] = useState(null);
    const [errors, setErrors] = useState({});

    const validateCurp = (curpValue) => {
        // Client-side validation only - check format
        if (curpValue.length !== 18) {
            setCurpValidation({ valid: false, message: 'El CURP debe tener 18 caracteres' });
            return;
        }

        // Validate CURP format regex
        const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
        if (!CURP_REGEX.test(curpValue)) {
            setCurpValidation({ valid: false, message: 'Formato de CURP inválido' });
            return;
        }

        // Format is valid
        setCurpValidation({
            valid: true,
            exists: true,
            message: 'CURP válido'
        });
    };

    const handleCurpChange = (e) => {
        const value = e.target.value.toUpperCase();
        setCurp(value);
        setCurpValidation(null);
        setErrors((prev) => ({ ...prev, curp: '' }));

        if (value.length === 18) {
            validateCurp(value);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setPhoneNumber(value);
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!curp || curp.length !== 18) {
            newErrors.curp = 'CURP inválido';
        }

        if (!curpValidation || !curpValidation.valid && !curpValidation.exists) {
            newErrors.curp = 'El CURP debe ser validado y verificado';
        }

        if (!phoneNumber || phoneNumber.length !== 10) {
            newErrors.phoneNumber = 'Teléfono debe tener 10 dígitos';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({ curp, phoneNumber });
    };

    const isFormValid = curp.length === 18 &&
        phoneNumber.length === 10 &&
        curpValidation &&
        (curpValidation.valid || curpValidation.exists);

    return (
        <div className="max-w-2xl mx-auto py-12 animate-fade-in">
            <button
                onClick={onBack}
                className="flex items-center text-guinda hover:text-guinda-dark mb-6 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a servicios
            </button>

            <div className="bg-gradient-to-br from-guinda to-guinda-dark text-white p-6 rounded-xl mb-8 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-dorado-light text-sm font-semibold mb-1">Trámite Seleccionado</p>
                        <h2 className="text-2xl font-bold">{service.name}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-dorado-light text-sm mb-1">Costo</p>
                        <p className="text-3xl font-bold">${service.price}</p>
                    </div>
                </div>
            </div>

            <div className="glass rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Datos del Solicitante
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CURP Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CURP (Clave Única de Registro de Población) *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={curp}
                                onChange={handleCurpChange}
                                maxLength={18}
                                placeholder="HEGG560427MVZRRL04"
                                className={`input-field ${errors.curp ? 'error' :
                                    curpValidation && (curpValidation.valid || curpValidation.exists) ? 'success' : ''
                                    }`}
                            />
                            {isValidating && (
                                <div className="absolute right-3 top-3">
                                    <div className="spinner"></div>
                                </div>
                            )}
                            {curpValidation && !isValidating && (
                                <div className="absolute right-3 top-3">
                                    {(curpValidation.valid || curpValidation.exists) ? (
                                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                            )}
                        </div>
                        {curpValidation && (
                            <p className={`text-sm mt-2 ${curpValidation.valid || curpValidation.exists ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {curpValidation.message}
                            </p>
                        )}
                        {errors.curp && (
                            <p className="text-sm text-red-600 mt-2">{errors.curp}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            El CURP será validado con las bases de datos oficiales
                        </p>
                    </div>

                    {/* Phone Number Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Número de WhatsApp (ESENCIAL) *
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="5512345678"
                            className={`input-field ${errors.phoneNumber ? 'error' : ''}`}
                        />
                        {errors.phoneNumber && (
                            <p className="text-sm text-red-600 mt-2">{errors.phoneNumber}</p>
                        )}
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mt-2 rounded">
                            <p className="text-xs text-yellow-800 font-semibold flex items-start">
                                <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>
                                    <strong>MUY IMPORTANTE:</strong> Este número DEBE tener WhatsApp activo.
                                    Todos los documentos se enviarán por WhatsApp.
                                    Verifica que esté escrito correctamente (10 dígitos, sin espacios ni guiones).
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full btn-primary ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Continuar al Pago
                    </button>
                </form>
            </div>
        </div>
    );
}
