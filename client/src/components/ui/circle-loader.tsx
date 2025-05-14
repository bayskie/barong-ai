import { LoaderCircle } from "lucide-react";

export function CircleLoader({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle className={`animate-spin ${className}`} size={size} />
    </div>
  );
}
