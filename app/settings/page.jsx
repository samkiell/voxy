export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-gray-600">Manage your account preferences and security.</p>
      
      <div className="mt-8 space-y-8 max-w-2xl">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input type="text" className="w-full p-2 border rounded-lg" defaultValue="Samkiel" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input type="email" className="w-full p-2 border rounded-lg" placeholder="samkiel@example.com" />
            </div>
          </div>
        </section>
        
        <section className="space-y-4 pt-4 border-t">
          <h2 className="text-xl font-semibold">Security</h2>
          <button className="px-4 py-2 border rounded-lg font-medium text-red-600 border-red-200 bg-red-50">Change Password</button>
        </section>
      </div>
    </div>
  );
}
