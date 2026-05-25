
export const PROJECT_OVERRIDES: Record<string, string> = {};

export function patchProject(project: any) {
  if (!project) return project;
  
  // No longer patching cover_url from front-end
  
  return project;
}

export function patchProjects(projects: any[]) {
  if (!projects) return projects;
  return projects.map(patchProject);
}

