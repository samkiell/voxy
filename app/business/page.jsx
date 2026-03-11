export default function BusinessPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Business Profile</h1>
      <p className="mt-2 text-gray-600">Configure business information that AI will use for responses.</p>
      
      <form className="mt-8 space-y-6 max-w-2xl">
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Name</label>
          <input type="text" className="w-full p-2 border rounded-lg" placeholder="e.g. Samkiel's Barbershop" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea className="w-full p-2 border rounded-lg h-32" placeholder="Describe your business..."></textarea>
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">Save Profile</button>
      </form>
    </div>
  );
}
