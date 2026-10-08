async function fetchJobPage(url) {
  // Starter boundary only.
  // Production implementation should use an HTTP client with timeout,
  // redirect limits, robots/terms checks and safe URL validation.
  //
  // Node 20+ provides global fetch:
  const response = await fetch(url, {
    headers: {
      "User-Agent": "JobPortalJobFetcher/1.0"
    },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch job page: HTTP ${response.status}`);
  }

  return response.text();
}

module.exports = { fetchJobPage };
