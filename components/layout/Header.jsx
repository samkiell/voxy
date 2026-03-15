export default function Header({ title }) {
  return (
    <header className="h-16 border-b border-white/5 bg-black flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400">
          <span className="text-xl">🔔</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-zinc-900 overflow-hidden border border-white/10">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Samkiel" alt="User" />
        </div>
      </div>
    </header>
  );
}
