import PublicLayout from '@/components/layout/PublicLayout';

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 text-center">Login</h1>
          <p className="mt-4 text text-slate-600 text-center">Enter your credentials to access your LocalVoice AI dashboard.</p>
          
          <form className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input type="password" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">Login</button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
