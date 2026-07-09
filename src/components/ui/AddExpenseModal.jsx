import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../../services/api';
import { X, DollarSign, Calendar, Tag, CreditCard, Store, FileText } from 'lucide-react';
import CustomSelect from './CustomSelect';

const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Travel & Transport",
  "Bills & Utilities",
  "Entertainment",
  "Health & Medical",
  "Others"
];

const PAYMENT_METHODS = [
  "Cash",
  "Card",
  "UPI"
];

export default function AddExpenseModal({ isOpen, onClose, onSuccess, showToast, transactionToEdit = null }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [merchant, setMerchant] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync inputs when opening the modal for creating or editing
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        setAmount(transactionToEdit.amount?.toString() || '');
        setCategory(transactionToEdit.category || CATEGORIES[0]);
        setPaymentMethod(transactionToEdit.payment_method || PAYMENT_METHODS[0]);
        setMerchant(transactionToEdit.merchant || '');
        setDescription(transactionToEdit.description || '');
        
        const dateVal = transactionToEdit.transaction_date || transactionToEdit.created_at;
        if (dateVal) {
          setDate(dateVal.split('T')[0]);
        } else {
          setDate(new Date().toISOString().split('T')[0]);
        }
      } else {
        setAmount('');
        setCategory(CATEGORIES[0]);
        setPaymentMethod(PAYMENT_METHODS[0]);
        setMerchant('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
      }
      setErrorMsg('');
    }
  }, [isOpen, transactionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid positive amount.');
      return;
    }

    if (!merchant.trim()) {
      setErrorMsg('Merchant name is required.');
      return;
    }

    setLoading(true);
    try {
      const transactionDate = date ? new Date(date).toISOString() : new Date().toISOString();
      
      const payload = {
        amount: parsedAmount,
        category,
        payment_method: paymentMethod,
        merchant: merchant.trim(),
        description: description.trim() || undefined,
        transaction_date: transactionDate
      };

      if (transactionToEdit) {
        const id = transactionToEdit._id || transactionToEdit.id;
        await transactionAPI.update(id, payload);
        if (showToast) {
          showToast('Expense updated successfully!', 'success');
        }
      } else {
        await transactionAPI.create(payload);
        if (showToast) {
          showToast('Expense logged successfully!', 'success');
        }
      }
      
      // Reset form
      setAmount('');
      setCategory(CATEGORIES[0]);
      setPaymentMethod(PAYMENT_METHODS[0]);
      setMerchant('');
      setDescription('');
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-card-dark rounded-t-3xl sm:rounded-3xl border border-slate-100 dark:border-border-dark p-6 shadow-2xl animate-slide-up transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {transactionToEdit ? 'Edit Expense' : 'Log New Expense'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Amount Field (Highlighted) */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <DollarSign className="w-5 h-5" />
            </span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-base font-bold focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Merchant */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <Store className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="Merchant (e.g. Starbucks)"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-sm focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Category Dropdown */}
          <CustomSelect
            value={category}
            onChange={(val) => setCategory(val)}
            options={CATEGORIES}
            placeholder="Select Category"
            icon={Tag}
          />

          {/* Payment Method & Date (Two Column Layout) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Payment Method */}
            <CustomSelect
              value={paymentMethod}
              onChange={(val) => setPaymentMethod(val)}
              options={PAYMENT_METHODS}
              placeholder="Select Payment"
              icon={CreditCard}
            />

            {/* Date */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-xs focus:outline-none transition-colors duration-200 cursor-pointer text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Description */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              <FileText className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl text-sm focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-violet-500/20 active:scale-98 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              transactionToEdit ? 'Save Changes' : 'Log Expense'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
