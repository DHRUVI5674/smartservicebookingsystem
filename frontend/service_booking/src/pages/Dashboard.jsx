import { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';

export default function Dashboard() {
  const { user, token } = useGlobal();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    serviceType: 'Deep Home Cleaning',
    scheduleDate: '',
    amount: '$80'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingForm)
      });
      if (response.ok) {
        await fetchBookings();
        setShowModal(false);
      }
    } catch (err) {
      console.error('Failed to create booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-indigo-100 text-indigo-700';
      case 'In Review': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="py-12 bg-slate-50/50 min-h-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Dashboard</h1>
            <p className="text-slate-500 font-medium tracking-tight">Manage your active service requests and history.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary px-8 py-3 shadow-lg shadow-indigo-200"
          >
             + New Booking
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Jobs', val: bookings.filter(b => b.status === 'In Progress' || b.status === 'Pending').length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Completed', val: bookings.filter(b => b.status === 'Completed').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Saved Pros', val: '8', color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Total Spent', val: `$${bookings.reduce((acc, b) => acc + parseInt(b.amount.replace('$', '') || 0), 0)}`, color: 'text-slate-900', bg: 'bg-slate-50' },
          ].map(stat => (
            <div key={stat.label} className="clear-card p-6 flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-4">{stat.label}</span>
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
            <button className="text-xs font-black text-indigo-600 hover:underline px-4 py-2 bg-indigo-50 rounded-lg transition-all">View All →</button>
          </div>
          
          <div className="overflow-x-auto min-h-[300px] relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] z-10 transition-opacity">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold text-indigo-600 animate-pulse">Fetching your bookings...</p>
              </div>
            ) : null}

            {bookings.length > 0 ? (
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
                  {bookings.map((row) => (
                    <tr key={row._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-5 px-8 text-sm font-bold text-slate-900">{row.serviceType}</td>
                      <td className="py-5 px-8 text-sm text-slate-500 font-medium">{row.scheduleDate}</td>
                      <td className="py-5 px-8 text-sm">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-sm font-black text-slate-900">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-slate-500 font-medium">No bookings found. Try creating one!</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="clear-card w-full max-w-md p-8 bg-white shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Create New Booking</h2>
            
            <form onSubmit={handleCreateBooking} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Service Type</label>
                <select 
                  className="block w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                  value={bookingForm.serviceType}
                  onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
                >
                  <option>Deep Home Cleaning</option>
                  <option>Emergency Plumbing</option>
                  <option>Electrical Panel Fix</option>
                  <option>Pest Control</option>
                  <option>AC Servicing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Schedule Date</label>
                <input 
                  type="date" 
                  required
                  className="block w-full border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-slate-900"
                  value={bookingForm.scheduleDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, scheduleDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Estimated Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold">$</span>
                  <input 
                    type="number" 
                    className="block w-full border border-slate-200 rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                    value={bookingForm.amount.replace('$', '')}
                    onChange={(e) => setBookingForm({ ...bookingForm, amount: `$${e.target.value}` })}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full btn btn-primary py-4 text-base shadow-lg shadow-indigo-200 disabled:opacity-50 mt-4"
              >
                {submitting ? 'Creating...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
