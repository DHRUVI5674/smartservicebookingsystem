import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MOCK_API_BOOKINGS = [
  { service: 'Deep Home Cleaning', date: 'Oct 24, 2023', status: 'Completed', statusBg: 'bg-emerald-100 text-emerald-700', price: '$80' },
  { service: 'Emergency Plumbing', date: 'Oct 26, 2023', status: 'In Progress', statusBg: 'bg-indigo-100 text-indigo-700', price: '$120' },
  { service: 'Electrical Panel Fix', date: 'Nov 02, 2023', status: 'In Review', statusBg: 'bg-amber-100 text-amber-700', price: '$95' },
];

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect demonstration: Simulated API call on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookings(MOCK_API_BOOKINGS);
      setLoading(false);
    };

    fetchBookings();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="py-12 bg-slate-50/50 min-h-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage your active service requests and history.</p>
          </div>
          <button className="btn btn-primary px-8 py-3 shadow-lg shadow-indigo-200">
             + New Booking
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Jobs', val: '3', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Completed', val: '12', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Saved Pros', val: '8', color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Total Spent', val: '$450', color: 'text-slate-900', bg: 'bg-slate-50' },
          ].map(stat => (
            <div key={stat.label} className="clear-card p-6 flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</span>
              <div className="flex items-end justify-between">
                <span className={`text-3xl font-black ${stat.color}`}>{stat.val}</span>
                <div className={`${stat.bg} p-2 rounded-lg`}>📈</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="clear-card overflow-hidden shadow-sm">
          <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 tracking-tight text-lg">Recent Activity</h3>
            <button className="text-xs font-bold text-indigo-600 hover:underline px-4 py-2 bg-indigo-50 rounded-lg transition-colors">View All →</button>
          </div>
          
          <div className="overflow-x-auto min-h-[300px] relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] z-10 transition-opacity">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-indigo-600 animate-pulse">Fetching your bookings...</p>
              </div>
            ) : null}

            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] py-4 px-8">Service Type</th>
                  <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] py-4 px-8">Schedule Date</th>
                  <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] py-4 px-8">Job Status</th>
                  <th className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] py-4 px-8">Total Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bookings.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-8 text-sm font-bold text-slate-900">{row.service}</td>
                    <td className="py-5 px-8 text-sm text-slate-500 font-medium">{row.date}</td>
                    <td className="py-5 px-8 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.statusBg}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-sm font-black text-slate-900">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
