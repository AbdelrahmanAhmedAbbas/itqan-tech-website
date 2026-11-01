export function resolveProjectContent(project, flags = {}) {
  const status =
    project.slug === "middlemen-mdos" && flags.middlemenLive
      ? "live"
      : project.status;
  return {
    ...project,
    status,
    summary: [project.summary, project.statusSummaries?.[status]]
      .filter(Boolean)
      .join(" "),
    approach: project.statusApproaches?.[status] || project.approach,
  };
}
