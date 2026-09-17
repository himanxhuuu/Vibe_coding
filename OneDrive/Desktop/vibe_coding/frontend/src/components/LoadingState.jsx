export default function LoadingState() {
  return (
    <div className="grid min-h-96 grid-cols-1 gap-4 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 space-y-3">
            <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
