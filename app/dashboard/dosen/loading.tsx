export default function Loading() {
  return (
    <div className="flex items-center justify-center p-10 text-gray-500">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mr-3" />
      Memuat data...
    </div>
  );
}