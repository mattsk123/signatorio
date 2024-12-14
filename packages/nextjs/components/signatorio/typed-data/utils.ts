import { ArrowRightCircle, Box, Hash, List, Type } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  string: Type,
  address: Hash,
  bool: Box,
  default: ArrowRightCircle,
};

const TYPE_COLORS: Record<string, string> = {
  string: "bg-blue-100 text-blue-800",
  address: "bg-purple-100 text-purple-800",
  bool: "bg-green-100 text-green-800",
  default: "bg-gray-100 text-gray-800",
};

export const getTypeIcon = (typeName: string) => {
  if (/^(u)?int(\d+)$/.test(typeName)) {
    return Hash;
  }

  if (typeName.includes("[]")) {
    return List;
  }

  return TYPE_ICONS[typeName] || TYPE_ICONS["default"];
};

export const getTypeColor = (typeName: string) => {
  if (/^(u)?int(8|16|32|64|128|256)$/.test(typeName)) {
    return "bg-yellow-100 text-yellow-800";
  }

  if (typeName.includes("[]")) {
    return "bg-red-100 text-red-800";
  }

  return TYPE_COLORS[typeName] || TYPE_COLORS["default"];
};
