import { useCallback, useEffect, useState } from "react";
import { getRevenue } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";

function getErrorMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

export default function ManagePayments() {
  const [data, setData] = useState({
    payments: [],
    totalRevenue: 0,
    successfulCount: 0,
    failedCount: 0,
    refundedAmount: 0
  });
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: response } = await getRevenue();
      setData(response);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const rows = status === "all"
    ? data.payments
    : data.payments.filter((payment) => payment.status === status);

  return (
    <div>
      <div className="text-sm font-bold text-[#3157f5]">Razorpay transactions</div>
      <h1 className="text-2xl font-extrabold text-[#102044]">Payments</h1>
      {error && (
        <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p role="alert">{error}</p>
          <button type="button" className="mt-2 font-bold underline" onClick={loadPayments}>Try again</button>
        </div>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Successful" value={data.successfulCount} />
        <Metric title="Gross Revenue" value={formatCurrency(data.totalRevenue)} />
        <Metric title="Failed" value={data.failedCount} />
        <Metric title="Refunded" value={formatCurrency(data.refundedAmount)} />
      </div>
      <div className="soft-card mt-5 overflow-x-auto">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-extrabold">Transaction history</h3>
          <select className="input max-w-[160px]" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All</option>
            <option value="SUCCESS">Success</option>
            <option value="CREATED">Created</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-[#7c8aa5]">Loading payments...</p>
        ) : !error && rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-[#7c8aa5]">No payment records found.</p>
        ) : (
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b bg-[#fafbfe] text-xs uppercase text-[#8a97ad]">
              <tr><th className="p-4">User</th><th>Plan</th><th>Amount</th><th>Razorpay Order</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {rows.map((payment) => (
                <tr className="border-b last:border-0" key={payment._id}>
                  <td className="p-4">
                    <div className="font-bold">{payment.user?.name || "—"}</div>
                    <div className="text-xs text-[#7c8aa5]">{payment.user?.email || ""}</div>
                  </td>
                  <td>{payment.plan?.name || "—"}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td className="font-mono text-xs">{payment.razorpayOrderId || "—"}</td>
                  <td><span className="rounded-full bg-[#f2f5fa] px-2 py-1 text-xs font-bold">{payment.status}</span></td>
                  <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="soft-card p-5">
      <div className="text-xs font-bold uppercase tracking-wide text-[#8a97ad]">{title}</div>
      <div className="mt-2 text-2xl font-black text-[#102044]">{value}</div>
    </div>
  );
}
