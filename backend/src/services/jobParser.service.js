function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getJsonLdJobPosting(html) {
  const matches = [...html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )];

  for (const match of matches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (item && item["@type"] === "JobPosting") {
          return item;
        }
      }
    } catch (_) {
      // Ignore malformed JSON-LD and continue.
    }
  }

  return null;
}

function parseJobPage(html, sourceUrl) {
  const job = getJsonLdJobPosting(html);

  if (job) {
    const org = job.hiringOrganization || {};
    const location = job.jobLocation;
    const address = Array.isArray(location) ? location[0]?.address : location?.address;

    return {
      companyName: org.name || "",
      companyWebsite: org.sameAs || "",
      title: job.title || "",
      location: address
        ? [address.addressLocality, address.addressRegion, address.addressCountry].filter(Boolean).join(", ")
        : "",
      experience: job.experienceRequirements || "",
      jobType: job.employmentType || "Full Time",
      qualification: job.educationRequirements || "",
      skills: Array.isArray(job.skills)
        ? job.skills
        : typeof job.skills === "string" ? job.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
      salary: job.baseSalary
        ? `${job.baseSalary.currency || ""} ${job.baseSalary.value?.value || job.baseSalary.value || ""}`.trim()
        : "",
      description: job.description || "",
      responsibilities: [],
      requirements: [],
      sourceUrl,
      fetchedAt: new Date()
    };
  }

  // Fallback: return raw text for admin review rather than guessing fields.
  return {
    companyName: "",
    title: "",
    location: "",
    experience: "",
    jobType: "Full Time",
    qualification: "",
    skills: [],
    salary: "",
    description: stripHtml(html).slice(0, 20000),
    responsibilities: [],
    requirements: [],
    sourceUrl,
    fetchedAt: new Date(),
    needsManualReview: true
  };
}

module.exports = { parseJobPage };
