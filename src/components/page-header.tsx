export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-[#203527]">{title}</h2>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-[#65725b]">
        {description}
      </p>
    </div>
  );
}
