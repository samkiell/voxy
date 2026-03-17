import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Building2, 
  Settings,
  LogOut,
  Users,
  X,
  Bookmark,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const role = user?.role || 'customer';
  const pathname = usePathname();

  const getNavItems = () => {
    if (role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ];
    } else if (role === 'customer') {
      return [
        { name: 'Chat', href: '/customer/chat', icon: MessageSquare },
        { name: 'Find Business', href: '/customer/find-business', icon: Building2 },
        { name: 'Bookmarks', href: '/customer/bookmarks', icon: Bookmark },
        { name: 'Settings', href: '/customer/settings', icon: Settings },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
        { name: 'Conversations', href: '/business/conversation', icon: MessageCircle },
        { name: 'Settings', href: '/business/settings', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();
  const userDisplayName = user?.full_name || user?.name || user?.email?.split('@')[0] || 'User';
  const roleLabel = role === 'business_owner' ? 'Business' : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static top-0 left-0 z-[70] h-screen w-72 bg-black flex flex-col border-r border-white/5 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo Section */}
        <div className="p-8 pt-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="size-10 bg-[#00D18F]/5 rounded-xl flex items-center justify-center border border-[#00D18F]/20 shadow-[0_0_20px_rgba(0,209,143,0.1)]">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-6 h-6 text-[#00D18F]" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M12 7l-2 6h4l-2 4" className="text-[#00D18F/80]" />
              </svg>
            </div>
            <span className="font-display text-2xl font-black tracking-tight text-white italic">Voxy</span>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-8 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => onClose?.()}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-white/5 text-[#00D18F]" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <item.icon className={`w-6 h-6 transition-colors ${isActive ? "text-[#00D18F]" : "text-white/70 group-hover:text-white"}`} />
                <span className="font-bold text-lg tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 pt-4 border-t border-white/5 space-y-4 mb-4">
          {/* Logout */}
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-5 py-4 text-zinc-400 hover:text-white transition-all w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-lg tracking-tight">Logout</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-4 px-4 py-4 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
            <div className="size-12 rounded-full bg-gradient-to-tr from-[#00D18F] to-emerald-400 flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,209,143,0.2)]">
              {userDisplayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-lg text-white truncate leading-none uppercase tracking-tighter">
                {userDisplayName}
              </div>
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">
                {roleLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
