/**
 * Authentication middleware to protect admin routes
 */

export function requireAuth(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }

    return res.status(401).json({
        error: 'No autorizado',
        message: 'Debe iniciar sesión para acceder a este recurso'
    });
}

/**
 * Check if user is authenticated (doesn't block, just adds flag)
 */
export function checkAuth(req, res, next) {
    req.isAuthenticated = !!(req.session && req.session.adminId);
    next();
}
