import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  CreditCard, 
  Store, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Travel & Transport",
  "Bills & Utilities",
  "Entertainment",
  "Health & Medical",
  "Others"
];

const PAYMENT_METHODS = ["Cash", "Card", "UPI"];

const CATEGORY_COLORS = {
  "Food & Dining": "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  "Shopping": "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
  "Travel & Transport": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  "Bills & Utilities": "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  "Entertainment": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
  "Health & Medical": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  "Others": "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  
  // Deleting State
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Fetch Transactions from API
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build API filters matching backend specifications
      const filters = {
        page: currentPage,
        limit,
        category: category || undefined,
        payment_method: paymentMethod || undefined
      };
      
      const response = await transactionAPI.list(filters);
      
      // Robust response parsing: supports both flat array and paginated object structures
      if (Array.isArray(response)) {
        setTransactions(response);
        setTotalPages(1);
      } else if (response && Array.isArray(response.transactions)) {
        setTransactions(response.transactions);
        setTotalPages(response.pagination?.pages || 1);
      } else if (response && Array.isArray(response.data)) {
        setTransactions(response.data);
        setTotalPages(response.pages || 1);
      } else {
        setTransactions([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err.message || 'Failed to retrieve transaction logs.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch lists when parameters update (searchQuery is filtered purely client-side)
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, category, paymentMethod]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategory('');
    setPaymentMethod('');
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    setDeleteLoadingId(id);
    try {
      await transactionAPI.delete(id);
      // Refresh list
      fetchTransactions();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete transaction');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const displayedTransactions = transactions.filter(t => {
    if (!searchQuery.trim()) return true;
    const searchLower = searchQuery.toLowerCase();
    const merchantMatch = t.merchant?.toLowerCase().includes(searchLower) || false;
    const descMatch = t.description?.toLowerCase().includes(searchLower) || false;
    const categoryMatch = t.category?.toLowerCase().includes(searchLower) || false;
    return merchantMatch || descMatch || categoryMatch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-bg-dark transition-colors duration-300">
      
      {/* Search & Filter Controls Header */}
      <div className="bg-white dark:bg-card-dark border-b border-slate-100 dark:border-border-dark p-4 space-y-3 shrink-0">
        
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchant, category, or description..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark focus:border-violet-500 rounded-xl text-xs focus:outline-none transition-colors"
            />
          </div>
        </form>

        {/* Dropdown Filters */}
        <div className="flex gap-2 text-xs">
          {/* Category Dropdown */}
          <div className="flex-1 relative">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-lg focus:outline-none focus:border-violet-500 text-slate-600 dark:text-slate-300 cursor-pointer text-[11px]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div className="flex-1 relative">
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-lg focus:outline-none focus:border-violet-500 text-slate-600 dark:text-slate-300 cursor-pointer text-[11px]"
            >
              <option value="">All Payments</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters Icon */}
          {(searchQuery || category || paymentMethod) && (
            <button
              onClick={handleResetFilters}
              className="px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg font-semibold transition-colors cursor-pointer text-[10px]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main List Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        
        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Syncing transactions...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{error}</p>
            <button 
              onClick={fetchTransactions}
              className="mt-3 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium"
            >
              Retry
            </button>
          </div>
        ) : displayedTransactions.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-3">
              <Store className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No Transactions Found</h4>
            <p className="text-[10px] text-slate-400 max-w-[200px] mt-1 leading-normal">
              Try adjusting your search criteria or log a new expense.
            </p>
          </div>
        ) : (
          /* List of Transaction Cards */
          displayedTransactions.map((t) => {
            const dateStr = t.transaction_date || t.date;
            const formattedDate = dateStr 
              ? new Date(dateStr).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })
              : '';
            
            return (
              <div 
                key={t._id || t.id}
                className="bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-4"
              >
                {/* Details Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border leading-none ${CATEGORY_COLORS[t.category] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
                      {t.category}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                      <CreditCard className="w-2.5 h-2.5" />
                      {t.payment_method}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {t.merchant}
                  </h4>
                  
                  {t.description && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate italic">
                      "{t.description}"
                    </p>
                  )}

                  <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {formattedDate}
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      ₹{t.amount?.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(t._id || t.id)}
                    disabled={deleteLoadingId === (t._id || t.id)}
                    className="w-8 h-8 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deleteLoadingId === (t._id || t.id) ? (
                      <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}

      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && !loading && (
        <div className="bg-white dark:bg-card-dark border-t border-slate-100 dark:border-border-dark py-3 px-6 flex items-center justify-between shrink-0 text-xs">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-violet-600 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          
          <span className="text-slate-400 font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-violet-600 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer font-medium"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
