import { useEffect, useState } from "react";
import { getPlans } from "../../services/subscriptionService";
import PlanCard from "../../components/subscription/PlanCard";

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    getPlans()
      .then(({ data }) => {
        if (active) setPlans(data.plans || []);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Unable to load subscription plans.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retry]);

  return (
    <section className="container-wide py-12">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-sm font-bold text-[#3157f5]">Simple access plans</div>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#102044]">Choose the plan that fits your job search</h1>
        <p className="mt-3 text-sm leading-6 text-[#7c8aa5]">Browse jobs for free. A subscription unlocks the ability to access company application links.</p>
      </div>
      {loading && <p className="mt-10 text-center text-sm text-[#7c8aa5]">Loading subscription plans...</p>}
      {!loading && error && (
        <div className="mx-auto mt-10 max-w-xl text-center">
          <p role="alert" className="text-sm text-red-600">{error}</p>
          <button className="btn-secondary mt-4" onClick={() => {
            setError("");
            setLoading(true);
            setRetry((value) => value + 1);
          }}>Try again</button>
        </div>
      )}
      {!loading && !error && plans.length === 0 && (
        <p className="mt-10 text-center text-sm text-[#7c8aa5]">No subscription plans are available right now. Please check back later.</p>
      )}
      {!loading && !error && plans.length > 0 && (
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {plans.map((plan, index) => (
            <PlanCard key={plan._id} plan={plan} featured={index === 1} />
          ))}
        </div>
      )}
    </section>
  );
}
