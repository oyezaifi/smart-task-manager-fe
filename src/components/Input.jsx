export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <input className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" {...props} />
      {error && <span className="text-xs text-red-600 mt-1 block">{error}</span>}
    </label>
  );
}


