export default function LanguagesPage() {
  const languages = ['English', 'Pidgin', 'Yoruba', 'Hausa', 'Igbo'];
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Languages</h1>
      <p className="mt-2 text-gray-600">Choose languages supported by the assistant.</p>
      
      <div className="mt-8 space-y-4 max-w-md">
        {languages.map((lang) => (
          <div key={lang} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
            <input type="checkbox" className="w-5 h-5" />
            <span className="font-medium">{lang}</span>
          </div>
        ))}
        <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium mt-4">Save Languages</button>
      </div>
    </div>
  );
}
