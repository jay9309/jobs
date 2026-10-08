import { useCallback, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { getAdminApplications, updateApplicationStatus } from "../../services/adminService";

function getErrorMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

export default function ManageApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAdminApplications();
      setItems(data.applications || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const changeStatus = async (id, status) => {
    setError("");
    setSuccess("");
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      setSuccess("Application status updated.");
      await loadApplications();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="text-sm font-bold text-[#3157f5]">Application tracking</div>
      <h1 className="text-2xl font-extrabold text-[#102044]">Applications</h1>
      <p className="mt-1 text-sm text-[#7c8aa5]">
        Track who unlocked which job and update the internal application status.
      </p>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
      <div className="soft-card mt-5 overflow-x-auto">
        {loading ? (
          <p className="p-5 text-sm text-[#7c8aa5]">Loading applications...</p>
        ) : !error && items.length === 0 ? (
          <p className="p-10 text-center text-sm text-[#7c8aa5]">No applications yet.</p>
        ) : (
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b bg-[#fafbfe] text-xs uppercase text-[#8a97ad]">
              <tr><th className="p-4">User</th><th>Job</th><th>Company</th><th>Applied</th><th>Status</th><th>Original Job</th></tr>
            </thead>
            <tbody>
              {items.map((application) => (
                <tr key={application._id} className="border-b last:border-0">
                  <td className="p-4">
                    <div className="font-bold">{application.user?.name || "—"}</div>
                    <div className="text-xs text-[#7c8aa5]">{application.user?.email || ""}</div>
                  </td>
                  <td className="font-bold">{application.job?.title || "Deleted job"}</td>
                  <td>{application.job?.company?.name || "—"}</td>
                  <td>
                    {application.createdAt || application.appliedAt
                      ? new Date(application.createdAt || application.appliedAt).toLocaleString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    <select
                      className="input max-w-[150px]"
                      value={application.status}
                      disabled={updatingId === application._id}
                      onChange={(event) => changeStatus(application._id, event.target.value)}
                    >
                      <option value="REDIRECTED">REDIRECTED</option>
                      <option value="APPLIED">APPLIED</option>
                      <option value="WITHDRAWN">WITHDRAWN</option>
                    </select>
                  </td>
                  <td>
                    {application.job?.sourceUrl
                      ? <a href={application.job.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#3157f5]">Open <ExternalLink size={14} /></a>
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
