import { LucideIcon } from "lucide-react"; // Assuming you map strings to icons in the page
import SectionTitle from "../common/SectionTitle";

interface CoreValueItem {
  title: string;
  description: string;
  IconComponent: LucideIcon; // Now expects the component directly
}

interface CoreValuesProps {
  values: CoreValueItem[];
  title?: string;
  subtitle?: string;
}

const CoreValuesDisplay: React.FC<CoreValuesProps> = ({
  values,
  title = "Our Core Values",
  subtitle = "The principles that guide us",
}) => {
  if (!values || values.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <SectionTitle title={title} subtitle={subtitle} centered />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg shadow-md text-center"
            >
              <div className="flex justify-center mb-4">
                <value.IconComponent className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                {value.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CoreValuesDisplay;
