export default function Header({ title }) {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">🔔</button>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Samkiel" alt="User" />
        </div>
      </div>
    </header>
  );
}
