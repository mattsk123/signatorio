import { getTypeColor, getTypeIcon } from "./utils";

interface TypeBadgeProps {
  type: string;
}

export const TypeBadge = ({ type }: TypeBadgeProps) => {
  const Icon = getTypeIcon(type);
  const color = getTypeColor(type);

  return (
    <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center space-x-1 ${color}`}>
      <Icon className="w-3 h-3 align-center" />
      <span>{type}</span>
    </div>
  );
};
