import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex bg-black min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={title || 'Voxy'} />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
