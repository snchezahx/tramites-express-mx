import express from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { validateCurp } from '../utils/curpValidator.js';
import { generateUniqueReference } from '../utils/referenceGenerator.js';

const router = express.Router();

// Configure multer for memory storage (we'll upload to Supabase Storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (JPEG, PNG) o PDF'));
        }
    }
});

/**
 * POST /api/orders/validate-curp
 * Validate CURP format and simulate government database check
 */
router.post('/validate-curp', async (req, res) => {
    try {
        const { curp } = req.body;

        if (!curp) {
            return res.status(400).json({
                valid: false,
                message: 'El CURP es requerido'
            });
        }

        const validation = await validateCurp(curp);
        res.json(validation);
    } catch (error) {
        console.error('Error validating CURP:', error);
        res.status(500).json({
            valid: false,
            message: 'Error al validar el CURP'
        });
    }
});

/**
 * POST /api/orders/create
 * Create a new order with unique reference number
 */
router.post('/create', async (req, res) => {
    try {
        const { serviceType, servicePrice, curp, phoneNumber } = req.body;

        // Validate required fields
        if (!serviceType || !servicePrice || !curp || !phoneNumber) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        // Validate CURP again before creating order
        const curpValidation = await validateCurp(curp);
        if (!curpValidation.valid && !curpValidation.exists) {
            return res.status(400).json({
                error: 'CURP inválido',
                message: curpValidation.message
            });
        }

        // Generate unique reference number
        const referenceNumber = await generateUniqueReference(async (ref) => {
            const { data } = await supabase
                .from('orders')
                .select('id')
                .eq('reference_number', ref)
                .single();
            return !!data;
        });

        // Create order in Supabase
        const { data: order, error } = await supabase
            .from('orders')
            .insert([
                {
                    reference_number: referenceNumber,
                    service_type: serviceType,
                    service_price: servicePrice,
                    curp: curp.toUpperCase(),
                    phone_number: phoneNumber,
                    status: 'Pendiente'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error('Error al crear la orden en la base de datos');
        }

        res.status(201).json({
            success: true,
            order: {
                id: order.id,
                referenceNumber: order.reference_number,
                serviceType: order.service_type,
                servicePrice: order.service_price,
                curp: order.curp,
                phoneNumber: order.phone_number,
                status: order.status,
                createdAt: order.created_at
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            error: 'Error al crear la orden',
            message: error.message
        });
    }
});

/**
 * POST /api/orders/upload-receipt/:id
 * Upload payment receipt for an order to Supabase Storage
 */
router.post('/upload-receipt/:id', upload.single('receipt'), async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                error: 'No se recibió ningún archivo'
            });
        }

        // Check if order exists
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return res.status(404).json({
                error: 'Orden no encontrada'
            });
        }

        // Generate unique filename
        const fileExt = req.file.originalname.split('.').pop();
        const fileName = `receipt-${id}-${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('payment-receipts')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return res.status(500).json({
                error: 'Error al subir el archivo a Supabase Storage',
                message: uploadError.message
            });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('payment-receipts')
            .getPublicUrl(fileName);

        const receiptUrl = publicUrlData.publicUrl;

        // Update order with receipt URL
        const { error: updateError } = await supabase
            .from('orders')
            .update({ receipt_url: receiptUrl })
            .eq('id', id);

        if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).json({
                error: 'Error al actualizar la orden',
                message: updateError.message
            });
        }

        res.json({
            success: true,
            message: 'Comprobante cargado exitosamente',
            receiptUrl
        });
    } catch (error) {
        console.error('Error uploading receipt:', error);
        res.status(500).json({
            error: 'Error al cargar el comprobante',
            message: error.message
        });
    }
});

export default router;
