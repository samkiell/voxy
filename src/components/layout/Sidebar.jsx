import Link from 'next/link';
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Building2, 
  Settings,
  LogOut,
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
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
      // business_owner or default business role
      return [
        { name: 'Dashboard', href: '/business/dashboard', icon: LayoutDashboard },
        { name: 'Conversations', href: '/business/conversation', icon: MessageSquare },
        { name: 'Settings', href: '/business/settings', icon: Settings },
      ];
    }
  };

  const navItems = getNavItems();

  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User';
  const userRoleDisplay = role === 'business_owner' ? 'Business' : role;

  return (
    <div className="w-64 bg-zinc-50 dark:bg-black text-zinc-500 dark:text-zinc-400 min-h-screen p-6 flex flex-col border-r border-zinc-200 dark:border-white/5 transition-colors">
      <div className="mb-10 flex items-center gap-3">
        <img src="/favicon.jpg" alt="Voxy Logo" className="size-8 rounded-lg object-cover" />
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Voxy</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-200/50 dark:hover:bg-white/5 hover:text-[#00D18F] transition-all group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{item.name}</span>
          </Link>
        ))}
        
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all group mt-4"
        >
          <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Logout</span>
        </button>
      </nav>
      
      <div className="pt-6 border-t border-zinc-200 dark:border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 rounded-full bg-[#00D18F] text-black flex items-center justify-center font-bold text-lg shadow-lg shadow-[#00D18F]/20">
            {userDisplayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tighter truncate w-32">{userDisplayName}</div>
            <div className="text-xs text-zinc-500 font-medium capitalize">{userRoleDisplay.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
