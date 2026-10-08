import { useCallback, useEffect, useState } from "react";
import { Edit3, Power } from "lucide-react";
import { getPlans, createPlan, updatePlan } from "../../services/subscriptionService";
import { formatCurrency } from "../../utils/formatCurrency";

const emptyForm = {
  name: "",
  price: "",
  validityDays: "",
  applicationLimit: 0,
  description: "",
  isActive: true
};

function getErrorMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

export default function ManagePlans() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getPlans(true);
      setPlans(data.plans || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      validityDays: Number(form.validityDays),
      applicationLimit: Number(form.applicationLimit)
    };

    try {
      if (editing) {
        await updatePlan(editing, payload);
      } else {
        await createPlan(payload);
      }
      setForm(emptyForm);
      setEditing(null);
      setSuccess(editing ? "Plan updated successfully." : "Plan created successfully.");
      await loadPlans();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const edit = (plan) => {
    setEditing(plan._id);
    setForm({
      name: plan.name,
      price: plan.price,
      validityDays: plan.validityDays,
      applicationLimit: plan.applicationLimit,
      description: plan.description || "",
      isActive: plan.isActive
    });
    setError("");
    setSuccess("");
  };

  const toggle = async (plan) => {
    setError("");
    setSuccess("");
    try {
      await updatePlan(plan._id, { isActive: !plan.isActive });
      setSuccess(`Plan ${plan.isActive ? "deactivated" : "activated"} successfully.`);
      await loadPlans();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  return (
    <div>
      <div>
        <div className="text-sm font-bold text-[#3157f5]">Business controls</div>
        <h1 className="text-2xl font-extrabold text-[#102044]">Subscription Plans</h1>
        <p className="mt-1 text-sm text-[#7c8aa5]">
          You decide the price, duration and application limit. Razorpay only processes the payment.
        </p>
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
        <form onSubmit={save} className="soft-card space-y-3 p-6">
          <h3 className="font-extrabold">{editing ? "Edit plan" : "Create plan"}</h3>
          <input
            className="input"
            placeholder="Plan name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            className="input"
            type="number"
            min="0"
            step="1"
            placeholder="Price (INR)"
            value={form.price}
            onChange={(event) => setForm({ ...form, price: event.target.value })}
            required
          />
          <input
            className="input"
            type="number"
            min="1"
            step="1"
            placeholder="Validity in days"
            value={form.validityDays}
            onChange={(event) => setForm({ ...form, validityDays: event.target.value })}
            required
          />
          <input
            className="input"
            type="number"
            min="0"
            step="1"
            placeholder="Application limit (0 = unlimited)"
            value={form.applicationLimit}
            onChange={(event) => setForm({ ...form, applicationLimit: event.target.value })}
            required
          />
          <textarea
            className="input min-h-24"
            placeholder="Plan description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
            />
            Active plan
          </label>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Plan" : "Create Plan"}
            </button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {loading && <p className="soft-card p-5 text-sm text-[#7c8aa5]">Loading subscription plans...</p>}
          {!loading && !error && plans.length === 0 && (
            <p className="soft-card p-5 text-sm text-[#7c8aa5]">No plans yet. Create a plan using the form.</p>
          )}
          {!loading && plans.map((plan) => (
            <div key={plan._id} className="soft-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-extrabold text-[#102044]">{plan.name}</div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${plan.isActive ? "bg-[#e9f8ef] text-[#1a8d5b]" : "bg-[#f0f1f4] text-[#7d8799]"}`}>
                    {plan.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-[#7c8aa5]">
                  {plan.validityDays} days · {plan.applicationLimit || "Unlimited"} applications
                </div>
                <p className="mt-2 text-sm text-[#7c8aa5]">{plan.description || "No description"}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right font-extrabold text-[#3157f5]">{formatCurrency(plan.price)}</div>
                <button type="button" onClick={() => edit(plan)} className="text-[#3157f5]" title="Edit plan" aria-label={`Edit ${plan.name}`}>
                  <Edit3 size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => toggle(plan)}
                  className={plan.isActive ? "text-red-500" : "text-[#1a8d5b]"}
                  title={plan.isActive ? "Deactivate plan" : "Activate plan"}
                  aria-label={`${plan.isActive ? "Deactivate" : "Activate"} ${plan.name}`}
                >
                  <Power size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
