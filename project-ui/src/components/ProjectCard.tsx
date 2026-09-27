import { cardThemeStyle, tagsFromIndustry, type Project, type ViewMode } from "../model";
import { FeaturedBadge } from "./FeaturedBadge";
import { ProjectLogo } from "./ProjectLogo";
import { ProjectTags } from "./ProjectTags";
import { ProjectPasswordRow } from "./ProjectPasswordRow";
import { ProjectLinkRow } from "./ProjectLinkRow";

export function ProjectCard({
  project,
  viewMode = "cards",
  passwordVisible = false,
  copied = null,
  onTogglePassword,
  onCopyPassword,
  onCopyLink,
}: {
  project: Project;
  viewMode?: ViewMode;
  passwordVisible?: boolean;
  copied?: "link" | "password" | null;
  onTogglePassword?: () => void;
  onCopyPassword?: () => void;
  onCopyLink?: () => void;
}) {
  const tags = tagsFromIndustry(project.industry);
  const hasPassword = Boolean(project.password);

  return (
    <article
      data-product-id={project.id}
      style={cardThemeStyle(project.color)}
      className={`group relative w-full overflow-hidden border border-white/[0.09] bg-[#202020] shadow-[0_18px_55px_rgba(0,0,0,.22)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-500/25 ${viewMode === "cards" ? "rounded-[1.4rem]" : "rounded-2xl"}`}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-[var(--card-accent)] opacity-90" />
      <div className={viewMode === "cards" ? "p-4 sm:p-[1.125rem]" : "p-3 sm:p-3.5"}>
        {viewMode === "compact" ? (
          <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] md:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <ProjectLogo src={project.logoUrl} size="md" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-zinc-50">{project.name}</h2>
                  {project.featured && <FeaturedBadge compact />}
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-zinc-400 md:line-clamp-1">{project.idea}</p>
                <ProjectTags tags={tags} nowrap />
              </div>
            </div>
            <div className="flex min-w-0 w-full flex-col gap-2">
              {hasPassword && (
                <ProjectPasswordRow
                  password={project.password}
                  visible={passwordVisible}
                  copied={copied === "password"}
                  layout="compact"
                  onToggleVisible={() => onTogglePassword?.()}
                  onCopy={() => onCopyPassword?.()}
                />
              )}
              <div className="min-w-0 w-full">
                <ProjectLinkRow link={project.link} copied={copied === "link"} hasPassword={hasPassword} onCopy={() => onCopyLink?.()} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3.5 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <ProjectLogo src={project.logoUrl} size="sm" />
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap gap-1.5">{project.featured && <FeaturedBadge />}</div>
                  <h2 className="min-w-0 truncate text-lg font-semibold tracking-[-0.025em] text-zinc-50">{project.name}</h2>
                </div>
              </div>
            </div>
            <div className="mb-2.5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Product idea</p>
              <p className="text-sm leading-5 text-zinc-300 [overflow-wrap:anywhere] md:[overflow-wrap:normal]">{project.idea}</p>
              <ProjectTags tags={tags} />
            </div>
            <div className="grid gap-2.5">
              {hasPassword && (
                <ProjectPasswordRow
                  password={project.password}
                  visible={passwordVisible}
                  copied={copied === "password"}
                  layout="card"
                  onToggleVisible={() => onTogglePassword?.()}
                  onCopy={() => onCopyPassword?.()}
                />
              )}
              <ProjectLinkRow link={project.link} copied={copied === "link"} hasPassword={hasPassword} onCopy={() => onCopyLink?.()} />
            </div>
          </>
        )}
      </div>
    </article>
  );
}
