"use client";

import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  Users, 
  Scissors, 
  Package, 
  LogOut,
  Bell,
  Search,
  User,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LangToggle } from '@/components/LangToggle';
import { logoutAction } from '@/app/actions/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes('/login');
  const locale = pathname.split('/')[1] || 'es';

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: `/${locale}/admin`, active: pathname.endsWith('/admin') },
    { name: 'Citas', icon: Calendar, href: `/${locale}/admin/bookings` },
    { name: 'Servicios', icon: Scissors, href: `/${locale}/admin/services` },
    { name: 'Staff / Equipo', icon: Users, href: `/${locale}/admin/staff` },
    { name: 'Productos', icon: Package, href: `/${locale}/admin/products` },
    { name: 'Configuración', icon: Settings, href: `/${locale}/admin/settings` },
  ];

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-white/5 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">ZyncAdmin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                item.active 
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/20' 
                  : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'group-hover:text-purple-500 transition-colors'}`} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5">
          <button 
            onClick={() => logoutAction(locale)}
            className="flex items-center gap-3 px-4 py-3 w-full text-rose-500 font-semibold hover:bg-rose-500/5 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-transparent focus-within:border-purple-500/50 transition-all w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar citas, clientes..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-slate-500 dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
              <ThemeToggle />
              <LangToggle />
            </div>
            
            <button className="relative p-2 text-slate-500 dark:text-zinc-400 hover:text-purple-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-black"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:border-white/10"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Admin User</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1 font-bold uppercase tracking-wider">Plan Pro</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <User className="text-white w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
