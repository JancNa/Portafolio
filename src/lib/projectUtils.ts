
export const PROJECT_OVERRIDES: Record<string, string> = {
  'gamificacion': 'https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Gemini_Generated_Image_j4o0kmj4o0kmj4o0.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvR2VtaW5pX0dlbmVyYXRlZF9JbWFnZV9qNG8wa21qNG8wa21qNG8wLnBuZyIsImlhdCI6MTc3OTA0MzE5NCwiZXhwIjoxODEwNTc5MTk0fQ.YEPbppEziPdV7Ggr5tE9Tq8cgmEU3XRMDzC3rrYxDvA',
  'lealtad': 'https://fmigvcjlgrhgicyawiyq.supabase.co/storage/v1/object/sign/Assets/Gemini_Generated_Image_dlw6ludlw6ludlw6.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMzI1NDE1Mi1hMjA5LTRhOWUtYWQxYS05ZDYxMTI1ZDc5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJBc3NldHMvR2VtaW5pX0dlbmVyYXRlZF9JbWFnZV9kbHc2bHVkbHc2bHVkbHc2LnBuZyIsImlhdCI6MTc3OTA0MzIxNCwiZXhwIjoxODEwNTc5MjE0fQ.8bEFN7ngu6QgJNXSBg3qaYRlCs1g4Xwe7Sbg0Yt5ZBM'
};

export function patchProject(project: any) {
  if (!project) return project;
  
  const slug = project.slug;
  if (slug && PROJECT_OVERRIDES[slug]) {
    return { ...project, cover_url: PROJECT_OVERRIDES[slug] };
  }
  
  // Also try by title lowercase
  const title = project.title?.toLowerCase() || "";
  if (title.includes('gamificaci') && PROJECT_OVERRIDES['gamificacion']) {
    return { ...project, cover_url: PROJECT_OVERRIDES['gamificacion'] };
  }
  if (title.includes('lealtad') && PROJECT_OVERRIDES['lealtad']) {
    return { ...project, cover_url: PROJECT_OVERRIDES['lealtad'] };
  }

  return project;
}

export function patchProjects(projects: any[]) {
  if (!projects) return projects;
  return projects.map(patchProject);
}
