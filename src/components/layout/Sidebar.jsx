import Link from 'next/link';
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Building2, 
  Settings,
  LogOut,
  Users,
  X,
  Target,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const role = user?.role || 'customer';

  const getNavItems = () => {
    if (role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ];
    } else if (role === 'customer') {
      return [
        { name: 'Chat', href: '/customer/chat', icon: MessageSquare },
        { name: 'Find Business', href: '/customer/find-business', icon: Building2 },
        { name: 'Bookmarks', href: '/customer/bookmarks', icon: Bot },
        { name: 'Settings', href: '/customer/settings', icon: Settings },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
        { name: 'Conversations', href: '/business/conversation', icon: MessageSquare },
        { name: 'Settings', href: '/business/settings', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();
  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User';
  const userRoleDisplay = role === 'business_owner' ? 'Merchant' : role;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden transition-opacity duration-500 ease-in-out"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static top-0 left-0 z-[70] h-screen w-72 bg-white dark:bg-[#09090b] p-8 flex flex-col border-r border-zinc-100 dark:border-white/5 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="size-10 bg-[#00D18F] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-[#00D18F]/20">
                <Target className="text-white w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white dark:bg-[#09090b] rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#00D18F] rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="font-display text-2xl font-black tracking-tighter text-zinc-900 dark:text-white italic">VO<span className="text-[#00D18F]">XY</span></span>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-3 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto py-4 -mx-2 px-2 custom-scrollbar">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={() => onClose?.()}
              className="flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-zinc-500 dark:text-zinc-400 hover:bg-[#00D18F]/10 hover:text-[#00D18F] transition-all duration-300 group relative overflow-hidden"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
              <span className="font-bold tracking-tight text-sm uppercase tracking-widest">{item.name}</span>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 group-hover:h-8 bg-[#00D18F] rounded-full transition-all duration-500"></div>
            </Link>
          ))}
        </nav>
        
        <div className="pt-10 border-t border-zinc-100 dark:border-white/5 mt-auto space-y-8">
          <div className="flex items-center gap-4 px-2 group cursor-pointer p-4 rounded-3xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-500">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D18F] to-[#00A370] text-black flex items-center justify-center font-display font-black text-2xl shadow-2xl shadow-[#00D18F]/30 group-hover:scale-105 transition-all duration-500 border-4 border-white dark:border-[#09090b]">
                {userDisplayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00D18F] rounded-full border-4 border-white dark:border-[#09090b]"></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter truncate leading-none mb-1">{userDisplayName}</div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#00D18F]" />
                <span className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] truncate">{userRoleDisplay}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-[1.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white transition-all duration-500 group shadow-xl active:scale-95"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
