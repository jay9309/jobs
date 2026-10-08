import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";

export function useJobs(params = {}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getJobs(params)
      .then(({ data }) => active && setJobs(data.jobs || []))
      .catch(() => active && setJobs([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [JSON.stringify(params)]);

  return { jobs, loading };
}
