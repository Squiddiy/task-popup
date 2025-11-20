export function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="tw:py-2">
      <div className="tw:grid tw:items-center tw:gap-x-3 tw:grid-cols-[1fr_auto]">
        {children}
      </div>
    </div>
  );
}
