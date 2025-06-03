interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean; // For text color on dark backgrounds
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered,
  light,
}) => {
  const textColor = light
    ? "text-white"
    : "text-neutral-800 dark:text-neutral-200";
  const subtitleColor = light
    ? "text-neutral-300"
    : "text-neutral-600 dark:text-neutral-400";
  const alignment = centered ? "text-center mx-auto" : "text-left";

  return (
    <div className={`mb-8 md:mb-12 ${alignment} max-w-2xl`}>
      {subtitle && (
        <p
          className={`text-sm font-semibold uppercase tracking-wider text-primary mb-2 ${subtitleColor}`}
        >
          {subtitle}
        </p>
      )}
      <h2 className={`text-3xl md:text-4xl font-bold ${textColor}`}>{title}</h2>
    </div>
  );
};
export default SectionTitle;
