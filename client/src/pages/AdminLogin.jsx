import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/admin/login', {
                username,
                password
            });

            if (response.data.success) {
                // Redirect to dashboard
                navigate('/admin-gestor-seguro/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-guinda-dark to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-greca-pattern opacity-5"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center space-x-1 mb-4">
                        <div className="w-2 h-16 bg-green-600 rounded"></div>
                        <div className="w-2 h-16 bg-white rounded"></div>
                        <div className="w-2 h-16 bg-red-600 rounded"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Trámites Express MX - Gestor Seguro
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8 shadow-2xl border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Usuario
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Nombre de usuario"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800 text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="spinner mr-2"></div>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-600 hover:text-guinda transition-colors"
                        >
                            ← Volver al sitio principal
                        </button>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Conexión segura y encriptada
                    </p>
                </div>
            </div>
        </div>
    );
}
