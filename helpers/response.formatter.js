/**
 * Format response konsisten untuk semua endpoint
 * @param {number} code    - HTTP status code (200, 201, 400, dll)
 * @param {string} message - Pesan singkat
 * @param {*}      data    - Data yang dikembalikan (opsional)
 */
const response = (code, message, data = null) => {
  return {
    code,
    status: code >= 200 && code < 300 ? 'success' : 'error',
    message,
    data
  };
};

module.exports = response;
