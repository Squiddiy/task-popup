export function ReadOnlyText({ value }: { value: React.ReactNode }) {
  return (
    <span className="tw:min-w-32 tw:flex-1 tw:text-gray-400">{value}</span>
  );
}