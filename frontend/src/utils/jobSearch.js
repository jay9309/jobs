const semanticGroups = [
  ["developer", "engineer", "programmer", "coder"],
  ["frontend", "front end", "ui developer"],
  ["backend", "back end", "server side"],
  ["full stack", "fullstack"],
  ["fresher", "entry level", "junior"],
  ["remote", "work from home", "wfh"],
  ["javascript", "js"],
  ["typescript", "ts"],
  ["react", "reactjs"],
  ["node", "nodejs"],
  ["qa", "quality assurance", "tester"],
  ["data analyst", "business analyst"]
];

const popularSearches = [
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Java Developer",
  "React Developer",
  "Python Developer",
  "Data Analyst",
  "QA Tester",
  "Remote Jobs"
];

export const normalizeSearchText = value => String(value || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9+#.]+/g, " ")
  .trim();

const normalize = normalizeSearchText;

function getSearchVariants(query) {
  const normalizedQuery = normalize(query);
  const variants = new Set([normalizedQuery]);
  semanticGroups.forEach(group => {
    if (group.some(term => normalizedQuery.includes(normalize(term)))) {
      group.forEach(term => variants.add(normalize(term)));
    }
  });
  return [...variants].filter(Boolean);
}

function getSearchBuckets(query) {
  const normalizedQuery = normalize(query);
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
  const consumedTerms = new Set();
  const buckets = [];

  semanticGroups.forEach(group => {
    const matchingAliases = group
      .map(normalize)
      .filter(alias => ` ${normalizedQuery} `.includes(` ${alias} `));
    if (!matchingAliases.length) return;

    matchingAliases.forEach(alias => alias.split(/\s+/).forEach(term => consumedTerms.add(term)));
    buckets.push(group.map(normalize));
  });

  queryTerms
    .filter(term => !consumedTerms.has(term))
    .forEach(term => buckets.push([term]));

  return buckets;
}

export function getKeywordSuggestions(jobs, query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const queryTerms = normalizedQuery.split(/\s+/);
  const partialTerm = queryTerms.pop();
  const completedTerms = queryTerms;
  const candidates = new Set(popularSearches);

  jobs.forEach(job => {
    [
      job.title,
      job.company?.name,
      job.location,
      job.jobType,
      ...(job.skills || [])
    ].filter(Boolean).forEach(candidate => candidates.add(String(candidate).trim()));
  });

  return [...candidates]
    .filter(candidate => {
      const normalizedCandidate = normalize(candidate);
      const candidateTerms = normalizedCandidate.split(/\s+/);
      const hasPartialMatch = candidateTerms.some(term => term.startsWith(partialTerm));
      return hasPartialMatch && completedTerms.every(term => normalizedCandidate.includes(term));
    })
    .sort((first, second) => {
      const firstNormalized = normalize(first);
      const secondNormalized = normalize(second);
      const firstStartsWith = firstNormalized.startsWith(normalizedQuery);
      const secondStartsWith = secondNormalized.startsWith(normalizedQuery);
      return Number(secondStartsWith) - Number(firstStartsWith) || first.length - second.length;
    })
    .slice(0, 5)
    .map(value => ({ value, type: "keyword" }));
}

export function rankJobSuggestions(jobs, query) {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  const variants = getSearchVariants(query);
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
  const searchBuckets = getSearchBuckets(query);
  if (!searchBuckets.length) return [];

  return jobs
    .map(job => {
      const title = normalize(job.title);
      const company = normalize(job.company?.name);
      const skills = normalize((job.skills || []).join(" "));
      const location = normalize(job.location);
      const otherDetails = normalize([
        job.description,
        job.experience,
        job.qualification,
        job.jobType,
        ...(job.responsibilities || []),
        ...(job.requirements || [])
      ].join(" "));
      const allDetails = [title, company, skills, location, otherDetails].join(" ");
      const hasSemanticMatch = searchBuckets.every(bucket => bucket.some(term => allDetails.includes(term)));

      if (!hasSemanticMatch) return null;

      let score = 0;
      variants.forEach(variant => {
        if (title.includes(variant)) score += variant === normalizedQuery ? 30 : 14;
        if (skills.includes(variant)) score += 11;
        if (company.includes(variant)) score += 10;
        if (location.includes(variant)) score += 7;
        if (otherDetails.includes(variant)) score += 4;
      });
      score += queryTerms.length * 3;
      return { job, score };
    })
    .filter(Boolean)
    .sort((first, second) => second.score - first.score)
    .map(({ job }) => job)
    .filter((job, index, matches) => matches.findIndex(match =>
      normalize(match.title) === normalize(job.title) &&
      normalize(match.company?.name) === normalize(job.company?.name)
    ) === index)
    .slice(0, 5);
}
