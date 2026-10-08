import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createJob,
  getJob,
  previewJobUrl,
  updateJob
} from "../../services/jobService";

export default function JobForm({ jobId }) {
  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    title: "",
    location: "",
    experience: "",
    jobType: "Full Time",
    qualification: "",
    skills: [],
    salary: "",
    description: "",
    responsibilities: [],
    requirements: [],
    sourceUrl: "",
    published: true
  });
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    if (jobId) {
      getJob(jobId)
        .then(({ data }) => {
          const job = data.job;
          setForm({
            ...job,
            companyName: job.company?.name || "",
            companyWebsite: job.company?.website || "",
            skills: job.skills || []
          });
          setUrl(job.sourceUrl || "");
        })
        .catch(() => {});
    }
  }, [jobId]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const fetchJob = async () => {
    const sourceUrl = url.trim();
    if (!sourceUrl) return;

    setLoading(true);
    setFetchError("");
    try {
      const { data } = await previewJobUrl(sourceUrl);
      setForm((current) => ({ ...current, ...data.job, sourceUrl }));
    } catch (error) {
      setFetchError(
        error.response?.data?.message || "Could not fetch this job URL."
      );
    } finally {
      setLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      skills: Array.isArray(form.skills)
        ? form.skills
        : form.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    };

    try {
      if (jobId) {
        await updateJob(jobId, payload);
      } else {
        await createJob(payload);
      }
      nav("/admin/jobs");
    } catch (error) {
      alert(error.response?.data?.message || "Could not save job.");
    }
  };

  return (
    <form onSubmit={submit} className="soft-card mt-6 max-w-5xl p-6">
      <div className="rounded-2xl bg-[#f3f6ff] p-5">
        <label
          htmlFor="job-url"
          className="text-xs font-extrabold uppercase tracking-wide text-[#667691]"
        >
          Company Job URL
        </label>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            id="job-url"
            className="input min-w-0"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://company.com/careers/job/123"
            type="url"
          />
          <button
            type="button"
            onClick={fetchJob}
            disabled={loading || !url.trim()}
            className="btn-primary w-full whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Fetching..." : "Fetch Job Details"}
          </button>
        </div>
        <p className="mt-2 text-xs text-[#7d8ba4]">
          The backend first looks for standard JobPosting structured data.
          Always review the preview before publishing.
        </p>
        {fetchError && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {fetchError}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="Company"
          value={form.companyName}
          onChange={(value) => update("companyName", value)}
        />
        <Field
          label="Job Title"
          value={form.title}
          onChange={(value) => update("title", value)}
        />
        <Field
          label="Location"
          value={form.location}
          onChange={(value) => update("location", value)}
        />
        <Field
          label="Experience"
          value={form.experience}
          onChange={(value) => update("experience", value)}
        />
        <Field
          label="Qualification"
          value={form.qualification}
          onChange={(value) => update("qualification", value)}
        />
        <Field
          label="Salary"
          value={form.salary}
          onChange={(value) => update("salary", value)}
        />
        <Field
          label="Skills (comma separated)"
          value={Array.isArray(form.skills) ? form.skills.join(", ") : form.skills}
          onChange={(value) => update("skills", value)}
        />
        <Field
          label="Source URL"
          value={form.sourceUrl}
          onChange={(value) => update("sourceUrl", value)}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-[#263a60]">Description</label>
        <textarea
          className="input mt-2 min-h-52"
          value={form.description || ""}
          onChange={(event) => update("description", event.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-[#263a60]">
          Requirements (one per line)
        </label>
        <textarea
          className="input mt-2 min-h-28"
          value={(form.requirements || []).join("\n")}
          onChange={(event) =>
            update(
              "requirements",
              event.target.value.split("\n").filter(Boolean)
            )
          }
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button className="btn-primary">
          {jobId ? "Update Job" : "Publish Job"}
        </button>
        <button
          type="button"
          onClick={() => nav("/admin/jobs")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-bold text-[#263a60]">{label}</label>
      <input
        className="input mt-2"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
