export function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <div className="tw:mt-1 tw:text-xs tw:text-rose-600">{error}</div>;
}