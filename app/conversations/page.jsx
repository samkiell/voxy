export default function ConversationsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Conversations</h1>
      <p className="mt-2 text-gray-600">Review past interactions and transcripts with your customers.</p>
      
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan="3">No conversations found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
