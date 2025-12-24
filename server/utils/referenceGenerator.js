/**
 * Generate unique payment reference number
 * Format: TMX-YYYYMMDD-XXXX
 * Where XXXX is a random 4-digit number
 */

export function generateReferenceNumber() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const dateStr = `${year}${month}${day}`;
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    return `TMX-${dateStr}-${randomNum}`;
}

/**
 * Generate unique reference with collision check
 * @param {Function} checkExisting - Async function to check if reference exists
 * @returns {Promise<string>}
 */
export async function generateUniqueReference(checkExisting) {
    let reference;
    let attempts = 0;
    const maxAttempts = 10;

    do {
        reference = generateReferenceNumber();
        const exists = await checkExisting(reference);

        if (!exists) {
            return reference;
        }

        attempts++;
    } while (attempts < maxAttempts);

    // If we couldn't generate a unique reference, add timestamp
    const timestamp = Date.now().toString().slice(-6);
    return `TMX-${timestamp}`;
}
