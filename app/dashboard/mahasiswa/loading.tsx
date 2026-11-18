export default function Loading() {
  return (
    <div className="flex items-center justify-center p-10 text-gray-500">
      <div className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full mr-3" />
      Memuat data...
    </div>
  );
}