// Instant feedback while a project page streams in: same full-screen dark
// frame ProjectHero opens with, so the hand-off doesn't flash.
export default function ProjectLoading() {
  return (
    <section aria-busy="true" aria-label="Đang tải dự án" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[var(--color-deep-earth)]">
      <div className="absolute inset-0 animate-pulse bg-[linear-gradient(180deg,rgba(38,34,32,0.3)_0%,rgba(38,34,32,0.1)_34%,rgba(38,34,32,0.78)_100%)]" />
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end gap-4 px-5 pb-12 sm:px-8 sm:pb-16 md:px-12 md:pb-22">
        <div className="h-3 w-40 rounded-xs bg-[rgba(250,245,238,0.18)]" />
        <div className="h-16 w-3/4 max-w-[640px] rounded-xs bg-[rgba(250,245,238,0.14)] md:h-24" />
        <div className="h-3 w-64 rounded-xs bg-[rgba(250,245,238,0.18)]" />
      </div>
    </section>
  );
}
