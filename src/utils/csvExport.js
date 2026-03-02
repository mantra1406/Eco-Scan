/**
 * Convert records array to CSV string
 * @param {array} records - Array of record objects
 * @returns {string} - CSV formatted string
 */
function recordsToCSV(records) {
  if (!records || records.length === 0) {
    return '';
  }

  const headers = [
    'ID',
    'Timestamp',
    'Category',
    'Waste Type',
    'Weight (kg)',
    'CO₂ Saved (kg)',
    'Trees Equivalent',
    'Green Points',
    'User',
  ];

  const rows = records.map((record) => [
    record.id,
    record.timestamp,
    record.category,
    record.wasteType,
    record.weight,
    record.carbonSaved,
    record.treesEquivalent,
    record.greenPoints,
    record.userId,
  ]);

  // Escape special characters and wrap in quotes if needed
  const escapeCell = (cell) => {
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Trigger file download
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType = 'text/csv') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export records to CSV file
 * @param {array} records - Array of record objects
 * @param {string} filename - Optional custom filename
 */
export function exportToCSV(records, filename = null) {
  if (!records || records.length === 0) {
    throw new Error('No records to export');
  }

  const csvContent = recordsToCSV(records);
  const dateStr = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `ecoscan-records-${dateStr}.csv`;

  downloadFile(csvContent, finalFilename, 'text/csv;charset=utf-8;');
}

/**
 * Format records for display in table
 * @param {array} records - Array of record objects
 * @returns {array} - Formatted records
 */
export function formatRecordsForDisplay(records) {
  if (!records) return [];
  
  return records.map((record) => ({
    ...record,
    formattedDate: new Date(record.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    formattedTime: new Date(record.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    shortId: record.id.split('-')[0],
  }));
}

/**
 * Filter records by date range
 * @param {array} records - Array of record objects
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @returns {array} - Filtered records
 */
export function filterByDateRange(records, fromDate, toDate) {
  if (!fromDate && !toDate) return records;
  
  return records.filter((record) => {
    const recordDate = new Date(record.timestamp);
    const recordDateStr = recordDate.toISOString().split('T')[0];
    
    if (fromDate && recordDateStr < fromDate) return false;
    if (toDate && recordDateStr > toDate) return false;
    
    return true;
  });
}

/**
 * Filter records by category
 * @param {array} records - Array of record objects
 * @param {string} category - Category to filter by
 * @returns {array} - Filtered records
 */
export function filterByCategory(records, category) {
  if (!category || category === 'All') return records;
  return records.filter((record) => record.category === category);
}

/**
 * Search records by text
 * @param {array} records - Array of record objects
 * @param {string} searchTerm - Search term
 * @returns {array} - Filtered records
 */
export function searchRecords(records, searchTerm) {
  if (!searchTerm) return records;
  
  const term = searchTerm.toLowerCase();
  return records.filter(
    (record) =>
      record.category.toLowerCase().includes(term) ||
      record.wasteType.toLowerCase().includes(term) ||
      record.userId.toLowerCase().includes(term)
  );
}
