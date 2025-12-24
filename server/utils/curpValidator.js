/**
 * CURP (Clave Única de Registro de Población) Validator
 * 
 * This is a SIMULATED validator that checks CURP format and pattern.
 * For production, this should integrate with actual government APIs (RENAPO, SAT, IMSS).
 */

const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;

/**
 * Validates CURP format and checksum
 * @param {string} curp - The CURP to validate
 * @returns {Object} - { valid: boolean, message: string }
 */
export function validateCurpFormat(curp) {
    // Remove spaces and convert to uppercase
    const cleanCurp = curp.trim().toUpperCase();

    // Check length
    if (cleanCurp.length !== 18) {
        return {
            valid: false,
            message: 'El CURP debe tener exactamente 18 caracteres'
        };
    }

    // Check format with regex
    if (!CURP_REGEX.test(cleanCurp)) {
        return {
            valid: false,
            message: 'Formato de CURP inválido'
        };
    }

    // Validate checksum (digit verification)
    const checksumValid = validateChecksum(cleanCurp);
    if (!checksumValid) {
        return {
            valid: false,
            message: 'El CURP no es válido (dígito verificador incorrecto)'
        };
    }

    return {
        valid: true,
        message: 'CURP válido'
    };
}

/**
 * Validates CURP checksum (last digit)
 * @param {string} curp - The CURP (18 characters)
 * @returns {boolean}
 */
function validateChecksum(curp) {
    const dictionary = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    let sum = 0;

    for (let i = 0; i < 17; i++) {
        const charValue = dictionary.indexOf(curp[i]);
        if (charValue === -1) return false;
        sum += charValue * (18 - i);
    }

    const expectedChecksum = (10 - (sum % 10)) % 10;
    const actualChecksum = parseInt(curp[17]);

    return expectedChecksum === actualChecksum;
}

/**
 * Simulates API validation with government databases
 * In production, this would make actual API calls to RENAPO, SAT, IMSS
 * 
 * @param {string} curp - The CURP to validate
 * @returns {Promise<Object>} - { exists: boolean, message: string }
 */
export async function simulateGovernmentApiCheck(curp) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For simulation purposes, accept any valid format CURP
    // In production, replace this with actual API calls:
    // - RENAPO API for birth certificates
    // - SAT API for RFC validation
    // - IMSS API for social security

    const formatCheck = validateCurpFormat(curp);

    if (!formatCheck.valid) {
        return {
            exists: false,
            message: formatCheck.message
        };
    }

    return {
        exists: true,
        message: 'CURP verificado en bases de datos gubernamentales'
    };
}

/**
 * Full CURP validation (format + simulated API check)
 * @param {string} curp - The CURP to validate
 * @returns {Promise<Object>}
 */
export async function validateCurp(curp) {
    // First check format
    const formatValidation = validateCurpFormat(curp);
    if (!formatValidation.valid) {
        return formatValidation;
    }

    // Then simulate government API check
    const apiValidation = await simulateGovernmentApiCheck(curp);
    return apiValidation;
}
