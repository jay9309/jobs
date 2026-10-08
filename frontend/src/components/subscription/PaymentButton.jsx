import { useState } from "react";
import { createOrder, verifyPayment } from "../../services/paymentService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../../context/SubscriptionContext";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function getPaymentFailureMessage(description) {
  if (description?.toLowerCase().includes("international cards are not supported")) {
    return "This Razorpay account does not accept international cards. Retry using UPI or an India-issued domestic card. To accept international cards, enable them in Razorpay after its required account approval.";
  }

  return description
    ? `Razorpay could not complete the payment: ${description}`
    : "Razorpay could not complete the payment. Please try another supported payment method.";
}

export default function PaymentButton({ plan }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startPayment = async () => {
    if (!isAuthenticated) return navigate("/login");
    setError("");
    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        throw new Error("Razorpay Checkout could not load. Check your internet connection and try again.");
      }

      const { data } = await createOrder(plan._id);
      if (!data.keyId || !data.order?.id || !Number.isFinite(Number(data.order.amount))) {
        throw new Error("The server returned an incomplete payment order. Please contact support.");
      }

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "JobNest",
        description: `${plan.name} subscription`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const { data: verification } = await verifyPayment({ ...response, paymentId: data.paymentId });
            if (!verification.success || !verification.subscription) {
              throw new Error("Payment was received, but the subscription was not activated. Please contact support before paying again.");
            }
            await refreshSubscription(verification.subscription);
            alert("Payment successful. Your subscription is now active.");
            navigate("/dashboard/subscription", { replace: true });
          } catch (verificationError) {
            setError(
              verificationError.response?.data?.message ||
              verificationError.message ||
              "Payment completed, but subscription activation could not be confirmed. Contact support before paying again."
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false)
        },
        theme: { color: "#3157f5" }
      };

      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", (event) => {
        setError(getPaymentFailureMessage(event.error?.description));
        setLoading(false);
      });
      checkout.open();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to start payment.");
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        onClick={startPayment}
        disabled={loading}
        className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Opening secure checkout..." : "Choose Plan →"}
      </button>
    </>
  );
}
