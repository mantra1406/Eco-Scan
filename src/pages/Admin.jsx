import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Filter, Calendar, Search, Package, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { useToast } from '../hooks/useToast';
import { exportToCSV } from '../utils/csvExport';
import { EMISSION_FACTORS } from '../config/constants';
import { getWasteTypeBadgeVariant } from '../components/ui/Badge';

const RECORDS_PER_PAGE = 10;

/**
 * Summary stat card component
 * @param {Object} props - Component props
 * @param {string} props.label - Stat label
 * @param {string|number} props.value - Stat value
 * @param {React.ReactNode} props.icon - Icon component
 */
function SummaryStat({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-eco-accent-dim flex items-center justify-center text-eco-accent">
        {icon}
      </div>
      <div>
        <div className="font-syne font-bold text-lg text-eco-text">{value}</div>
        <div className="text-xs text-eco-text-muted">{label}</div>
      </div>
    </div>
  );
}

/**
 * Admin page component
 */
export function Admin() {
  const { records, clearRecords, getTotalWeight, getTotalCO2Saved } = useApp();
  const { showSuccess, showError, showWarning } = useToast();

  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showClearModal, setShowClearModal] = useState(false);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // Date filter
      if (dateFrom || dateTo) {
        const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
        if (dateFrom && recordDate < dateFrom) return false;
        if (dateTo && recordDate > dateTo) return false;
      }

      // Category filter
      if (categoryFilter !== 'All' && record.category !== categoryFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesCategory = record.category.toLowerCase().includes(term);
        const matchesWasteType = record.wasteType.toLowerCase().includes(term);
        const matchesUser = record.userId.toLowerCase().includes(term);
        if (!matchesCategory && !matchesWasteType && !matchesUser) {
          return false;
        }
      }

      return true;
    });
  }, [records, dateFrom, dateTo, categoryFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / RECORDS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    return filteredRecords.slice(start, start + RECORDS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  // Summary stats
  const dateRange = useMemo(() => {
    if (filteredRecords.length === 0) return 'No records';
    const dates = filteredRecords.map((r) => new Date(r.timestamp));
    const earliest = new Date(Math.min(...dates));
    const latest = new Date(Math.max(...dates));
    return `${earliest.toLocaleDateString()} - ${latest.toLocaleDateString()}`;
  }, [filteredRecords]);

  const totalWeight = filteredRecords.reduce((sum, r) => sum + r.weight, 0);
  const totalCO2 = filteredRecords.reduce((sum, r) => sum + r.carbonSaved, 0);

  // Handlers
  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setCategoryFilter('All');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(filteredRecords);
      showSuccess(`Exported ${filteredRecords.length} records to CSV`);
    } catch (err) {
      showError('Failed to export records');
    }
  };

  const handleClearAll = () => {
    clearRecords();
    setShowClearModal(false);
    showWarning('All records have been deleted');
  };

  // Category options
  const categories = Object.keys(EMISSION_FACTORS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-syne font-bold text-3xl text-eco-text mb-2">
          Admin Panel
        </h1>
        <p className="text-eco-text-muted">
          Manage records, export data, and view system analytics
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card>
          <div className="flex flex-wrap gap-6">
            <SummaryStat
              label="Total Records"
              value={filteredRecords.length}
              icon={<Package className="w-5 h-5" />}
            />
            <SummaryStat
              label="Date Range"
              value={dateRange}
              icon={<Calendar className="w-5 h-5" />}
            />
            <SummaryStat
              label="Total Weight"
              value={`${totalWeight.toFixed(1)}kg`}
              icon={<Package className="w-5 h-5" />}
            />
            <SummaryStat
              label="Total CO₂ Saved"
              value={`${totalCO2.toFixed(1)}kg`}
              icon={<Package className="w-5 h-5" />}
            />
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Date From */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-sm text-eco-text-muted mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-eco-surface2 border border-eco-border text-eco-text text-sm focus:outline-none focus:ring-2 focus:ring-eco-accent"
              />
            </div>

            {/* Date To */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-sm text-eco-text-muted mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-eco-surface2 border border-eco-border text-eco-text text-sm focus:outline-none focus:ring-2 focus:ring-eco-accent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-sm text-eco-text-muted mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-eco-surface2 border border-eco-border text-eco-text text-sm focus:outline-none focus:ring-2 focus:ring-eco-accent"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-[2] min-w-[200px]">
              <label className="block text-sm text-eco-text-muted mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-eco-text-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by category, type, or user..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-eco-surface2 border border-eco-border text-eco-text text-sm focus:outline-none focus:ring-2 focus:ring-eco-accent"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <Button variant="ghost" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>

          {/* Filter count */}
          <div className="mt-4 pt-4 border-t border-eco-border text-sm text-eco-text-muted">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 mb-6"
      >
        <Button variant="secondary" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Button variant="danger" onClick={() => setShowClearModal(true)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All Records
        </Button>
      </motion.div>

      {/* Records Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-eco-text-muted mx-auto mb-4" />
              <h3 className="font-syne font-bold text-lg text-eco-text mb-2">
                No records match your filters
              </h3>
              <p className="text-eco-text-muted">
                Try adjusting your filter criteria
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-eco-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-eco-text-muted">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-eco-text-muted">Date/Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-eco-text-muted">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-eco-text-muted">Type</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-eco-text-muted">Weight</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-eco-text-muted">CO₂ Saved</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-eco-text-muted">Points</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-eco-text-muted">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-eco-border">
                    {paginatedRecords.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-eco-surface2/50"
                      >
                        <td className="py-3 px-4 text-sm text-eco-text-muted font-mono">
                          {record.id.split('-')[0]}
                        </td>
                        <td className="py-3 px-4 text-sm text-eco-text">
                          {new Date(record.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{EMISSION_FACTORS[record.category]?.icon || '📦'}</span>
                            <span className="text-sm text-eco-text">{record.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getWasteTypeBadgeVariant(record.wasteType)}>
                            {record.wasteType}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-eco-text text-right">
                          {record.weight.toFixed(1)}kg
                        </td>
                        <td className="py-3 px-4 text-sm text-eco-accent text-right">
                          {record.carbonSaved.toFixed(2)}kg
                        </td>
                        <td className="py-3 px-4 text-sm text-yellow-400 text-right font-medium">
                          {record.greenPoints}
                        </td>
                        <td className="py-3 px-4 text-sm text-eco-text">
                          {record.userId}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-eco-border">
                  <div className="text-sm text-eco-text-muted">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-eco-surface2 text-eco-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-border transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`
                          w-10 h-10 rounded-lg text-sm font-medium transition-colors
                          ${currentPage === page
                            ? 'bg-eco-accent text-eco-bg'
                            : 'bg-eco-surface2 text-eco-text hover:bg-eco-border'
                          }
                        `}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-eco-surface2 text-eco-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-eco-border transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        title="Clear All Records"
        message={`Are you sure? This will delete all ${records.length} records permanently.`}
        confirmText="Delete All"
        confirmVariant="danger"
      />
    </div>
  );
}

export default Admin;
