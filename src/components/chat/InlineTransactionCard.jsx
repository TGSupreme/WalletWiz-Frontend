import { Check, Calendar, Tag, CreditCard, Store, FileText } from 'lucide-react';

const CATEGORY_COLORS = {
  "Food & Dining": "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  "Shopping": "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
  "Travel & Transport": "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  "Bills & Utilities": "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  "Entertainment": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
  "Health & Medical": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  "Others": "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400"
};

export default function InlineTransactionCard({ transactionData }) {
  if (!transactionData) return null;

  const { amount, merchant, category, payment_method, transaction_date, description } = transactionData;

  const formattedDate = transaction_date 
    ? new Date(transaction_date).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : '';

  return (
    <div className="mt-3.5 w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-border-dark rounded-2xl p-4 transition-all animate-fade-in shadow-xs">
      {/* Visual Status Indicator */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Check className="w-3 h-3" />
          Logged Successfully
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          Source: AI Chat
        </span>
      </div>

      {/* Main Details */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-tight">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            {description || 'Untitled Expense'}
          </h4>
          {merchant && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 italic flex items-center gap-1 leading-none">
              <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              "{merchant}"
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">
            ₹{amount?.toFixed(2)}
          </span>
        </div>
      </div>

      <hr className="border-t border-slate-100 dark:border-border-dark my-2.5" />

      {/* Footer Tags */}
      <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
        {/* Category Tag */}
        {category && (
          <span className={`px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${CATEGORY_COLORS[category] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
            <Tag className="w-3 h-3 shrink-0" />
            {category}
          </span>
        )}

        {/* Payment Method Tag */}
        {payment_method && (
          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-border-dark flex items-center gap-1">
            <CreditCard className="w-3 h-3 shrink-0 text-slate-400" />
            {payment_method}
          </span>
        )}

        {/* Date Tag */}
        {formattedDate && (
          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-border-dark flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3 shrink-0 text-slate-400" />
            {formattedDate}
          </span>
        )}
      </div>
    </div>
  );
}
