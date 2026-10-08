import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, UserCheck, UserX } from "lucide-react";
import { getUsers, updateUserStatus } from "../../services/adminService";

function getErrorMessage(error) {
  return error.response?.data?.message || "Something went wrong. Please try again.";
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getUsers();
      setUsers(data.users || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggle = async (user) => {
    setError("");
    setSuccess("");
    setUpdatingId(user._id);
    try {
      await updateUserStatus(user._id, !user.isActive);
      setSuccess(`Account ${user.isActive ? "blocked" : "activated"} successfully.`);
      await loadUsers();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div>
        <div className="text-sm font-bold text-[#3157f5]">Customer management</div>
        <h1 className="text-2xl font-extrabold text-[#102044]">Users</h1>
        <p className="mt-1 text-sm text-[#7c8aa5]">See every account, role and account status.</p>
      </div>
      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
      <div className="soft-card mt-5 p-4">
        <input
          className="input"
          placeholder="Search by name or email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="soft-card mt-5 overflow-x-auto">
        {loading ? (
          <p className="p-5 text-sm text-[#7c8aa5]">Loading users...</p>
        ) : !error && filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-[#7c8aa5]">
            {users.length ? "No users match your search." : "No user accounts found."}
          </p>
        ) : (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-[#fafbfe] text-xs uppercase text-[#8a97ad]">
              <tr><th className="p-4">User</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} className="border-b last:border-0">
                  <td className="p-4">
                    <div className="font-bold text-[#102044]">{user.name}</div>
                    <div className="text-xs text-[#7c8aa5]">{user.email}</div>
                  </td>
                  <td>
                    {user.role === "ADMIN"
                      ? <span className="inline-flex items-center gap-1 text-[#3157f5]"><ShieldCheck size={15} /> Admin</span>
                      : "User"}
                  </td>
                  <td>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.isActive ? "bg-[#e9f8ef] text-[#1a8d5b]" : "bg-[#feecec] text-red-600"}`}>
                      {user.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                  <td>
                    {user.role !== "ADMIN" && (
                      <button
                        type="button"
                        disabled={updatingId === user._id}
                        onClick={() => toggle(user)}
                        className="inline-flex items-center gap-1 font-bold text-[#3157f5] disabled:opacity-50"
                      >
                        {user.isActive
                          ? <><UserX size={15} /> Block</>
                          : <><UserCheck size={15} /> Activate</>}
                      </button>
                    )}
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
