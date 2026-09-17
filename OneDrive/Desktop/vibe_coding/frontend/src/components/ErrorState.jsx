import { RefreshCw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-rose-900">Unable to load workspace</h2>
      <p className="mt-2 max-w-xl text-sm text-rose-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  );
}
