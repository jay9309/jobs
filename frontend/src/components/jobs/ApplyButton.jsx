import { useNavigate } from "react-router-dom";
import { applyToJob } from "../../services/applicationService";
import { useAuth } from "../../context/AuthContext";

export default function ApplyButton({ jobId }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleApply = async () => {
    if (!isAuthenticated) return navigate("/login");
    try {
      const { data } = await applyToJob(jobId);
      window.location.href = data.redirectUrl;
    } catch (error) {
      if (error.response?.status === 402) navigate("/subscriptions");
      else alert(error.response?.data?.message || "Unable to apply right now.");
    }
  };

  return <button onClick={handleApply} className="btn-primary w-full">Apply Now →</button>;
}
