import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, IndianRupee } from "lucide-react";
import { getRevenue } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";

function getErrorMessage(error) {
  return error.response?.data?.message || "Unable to load revenue data. Please try again.";
}

export default function Revenue() {
  const [data, setData] = useState({
    totalRevenue: 0,
    successfulCount: 0,
    failedCount: 0,
    refundedAmount: 0,
    daily: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRevenue = useCallback(async () => {
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
    loadRevenue();
  }, [loadRevenue]);

  const points = useMemo(
    () => Object.entries(data.daily || {}).sort((a, b) => a[0].localeCompare(b[0])).slice(-14),
    [data.daily]
  );
  const max = Math.max(...points.map((point) => point[1]), 1);

  return (
    <div>
      <div className="text-sm font-bold text-[#3157f5]">Business analytics</div>
      <h1 className="text-2xl font-extrabold text-[#102044]">Revenue</h1>
      <p className="mt-1 text-sm text-[#7c8aa5]">Gross successful subscription revenue recorded by JobOrbit.</p>
      {error && (
        <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p role="alert">{error}</p>
          <button type="button" className="mt-2 font-bold underline" onClick={loadRevenue}>Try again</button>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Gross Revenue" value={formatCurrency(data.totalRevenue)} icon={IndianRupee} />
        <Metric title="Successful Payments" value={data.successfulCount} icon={ArrowUpRight} />
        <Metric title="Failed Payments" value={data.failedCount} icon={ArrowDownRight} />
        <Metric title="Refunded" value={formatCurrency(data.refundedAmount)} icon={ArrowDownRight} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="soft-card p-6">
          <h3 className="font-extrabold text-[#102044]">Last 14 days</h3>
          <div className="mt-6 flex h-64 items-end gap-2 overflow-x-auto border-b border-[#edf1f7] pb-1">
            {loading ? (
              <div className="m-auto text-sm text-[#7c8aa5]">Loading revenue data...</div>
            ) : points.length ? (
              points.map(([day, value]) => (
                <div key={day} className="flex h-full min-w-[34px] flex-1 flex-col justify-end">
                  <div
                    title={`${day}: ${formatCurrency(value)}`}
                    className="mx-auto w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#3157f5] to-[#6b7fff]"
                    style={{ height: `${Math.max((value / max) * 88, 5)}%` }}
                  />
                  <div className="mt-2 -rotate-45 text-[9px] text-[#8a97ad]">{day.slice(5)}</div>
                </div>
              ))
            ) : (
              <div className="m-auto text-sm text-[#7c8aa5]">
                {error ? "Revenue data could not be loaded." : "No successful payments in this period."}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-[#0b2147] to-[#3157f5] p-6 text-white">
          <div className="text-sm font-bold text-white/60">Important</div>
          <h3 className="mt-2 text-xl font-extrabold">Revenue control</h3>
          <p className="mt-3 text-sm leading-6 text-white/75">
            This panel records the subscription amount captured by JobOrbit. Razorpay processing fees and settlements should be reconciled against the Razorpay dashboard before accounting for net profit.
          </p>
          <div className="mt-5 rounded-xl bg-white/10 p-4 text-sm">
            Gross revenue<br />
            <strong className="text-xl">{formatCurrency(data.totalRevenue)}</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ title, value, icon: Icon }) {
  return (
    <div className="soft-card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-wide text-[#8a97ad]">{title}</div>
        <Icon size={17} className="text-[#3157f5]" />
      </div>
      <div className="mt-2 text-2xl font-black text-[#102044]">{value}</div>
    </div>
  );
}
