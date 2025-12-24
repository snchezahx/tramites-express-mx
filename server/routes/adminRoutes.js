import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/admin/login
 * Authenticate admin user
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Usuario y contraseña son requeridos'
            });
        }

        // Find admin by username in Supabase
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username.toLowerCase())
            .single();

        if (error || !admin) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        // Create session
        req.session.adminId = admin.id;
        req.session.username = admin.username;

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            error: 'Error al iniciar sesión',
            message: error.message
        });
    }
});

/**
 * POST /api/admin/logout
 * Logout admin user
 */
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al cerrar sesión'
            });
        }
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    });
});

/**
 * GET /api/admin/orders
 * Get all orders (protected route)
 */
router.get('/orders', requireAuth, async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw new Error('Error al obtener las órdenes');
        }

        // Transform data to match frontend expectations
        const transformedOrders = orders.map(order => ({
            _id: order.id,
            referenceNumber: order.reference_number,
            serviceType: order.service_type,
            servicePrice: order.service_price,
            curp: order.curp,
            phoneNumber: order.phone_number,
            receiptUrl: order.receipt_url,
            status: order.status,
            createdAt: order.created_at
        }));

        res.json({
            success: true,
            orders: transformedOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            error: 'Error al obtener las órdenes',
            message: error.message
        });
    }
});

/**
 * PATCH /api/admin/orders/:id/status
 * Update order status (protected route)
 */
router.patch('/orders/:id/status', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['Pendiente', 'Pagado'].includes(status)) {
            return res.status(400).json({
                error: 'Estado inválido. Debe ser "Pendiente" o "Pagado"'
            });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error || !order) {
            return res.status(404).json({
                error: 'Orden no encontrada'
            });
        }

        // Transform data to match frontend expectations
        const transformedOrder = {
            _id: order.id,
            referenceNumber: order.reference_number,
            serviceType: order.service_type,
            servicePrice: order.service_price,
            curp: order.curp,
            phoneNumber: order.phone_number,
            receiptUrl: order.receipt_url,
            status: order.status,
            createdAt: order.created_at
        };

        res.json({
            success: true,
            message: 'Estado actualizado exitosamente',
            order: transformedOrder
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            error: 'Error al actualizar el estado',
            message: error.message
        });
    }
});

/**
 * GET /api/admin/check-auth
 * Check if admin is authenticated
 */
router.get('/check-auth', (req, res) => {
    if (req.session && req.session.adminId) {
        res.json({
            authenticated: true,
            username: req.session.username
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});

export default router;
