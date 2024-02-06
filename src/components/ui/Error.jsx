export default function Error({ message }) {
  return (
    <div className="flex items-center">
      <div className="relative w-full max-w-xl px-4 py-2 text-red-800 bg-red-200 rounded shadow">
        <span className="block text-sm">{message}</span>
      </div>
    </div>
  );
}
