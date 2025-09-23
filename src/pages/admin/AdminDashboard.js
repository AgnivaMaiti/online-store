import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // ensure only admins access this page
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        setError(userErr.message);
        return;
      }
      const user = userData?.user;
      const isAdmin = user?.user_metadata?.is_admin;
      if (!isAdmin) {
        // Not an admin: redirect to home
        navigate('/');
      } else {
        // Fetch payments
        await fetchPayments();
      }
    })();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    // Adjust table name/columns to your schema if different
    const { data, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPayments(data || []);
    }
    setLoading(false);
  };

  // Derived filtered payments
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== 'all' && (p.status || '').toLowerCase() !== statusFilter) {
        return false;
      }
      if (s) {
        const inEmail = (p.user_email || '').toLowerCase().includes(s);
        const inId = (p.id || '').toString().toLowerCase().includes(s);
        const inDesc = (p.description || '').toLowerCase().includes(s);
        if (!inEmail && !inId && !inDesc) return false;
      }
      if (startDate) {
        const created = new Date(p.created_at);
        if (created < new Date(startDate)) return false;
      }
      if (endDate) {
        const created = new Date(p.created_at);
        // include the end date day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (created > end) return false;
      }
      return true;
    });
  }, [payments, search, statusFilter, startDate, endDate]);

  const totalAmount = useMemo(() => {
    return filtered.reduce((sum, p) => {
      const amt = Number(p.amount || 0);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [filtered]);

  const totalCount = filtered.length;

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount, page]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ['id', 'user_email', 'amount', 'currency', 'status', 'description', 'created_at'];
    const rows = filtered.map((p) =>
      headers.map((h) => {
        const v = p[h] ?? '';
        // escape double quotes
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_export_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard - Purchases</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Search by email, id or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <label>
          From <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>
          To <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button onClick={() => { setSearch(''); setStatusFilter('all'); setStartDate(''); setEndDate(''); }}>
          Clear
        </button>
        <button onClick={exportCSV} disabled={!filtered.length}>
          Export CSV
        </button>
      </div>

      <div className="admin-stats">
        <div>Total purchases: {totalCount}</div>
        <div>Total amount: {totalAmount.toFixed(2)}</div>
      </div>

      {loading ? (
        <div>Loading payments...</div>
      ) : (
        <div className="payments-table-wrap">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Email</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.user_email || p.user_id}</td>
                  <td>{Number(p.amount || 0).toFixed(2)}</td>
                  <td>{p.currency || 'USD'}</td>
                  <td>{p.status || ''}</td>
                  <td>{p.description || ''}</td>
                  <td>{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {!paginated.length && (
                <tr>
                  <td colSpan={7}>No purchases found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} / {pageCount}
        </span>
        <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>
          Next
        </button>
      </div>
    </div>
  );
}
