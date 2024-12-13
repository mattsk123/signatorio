import { Fragment } from "react";
import { ArrowRightCircle, Box, Hash, List, Type } from "lucide-react";
import { TypedDataDefinition, isAddress } from "viem";
import { Address } from "~~/components/scaffold-eth";

const TypeBadge = ({ type }: { type: string }) => {
  const getTypeIcon = (typeName: string) => {
    const typeMap: Record<string, any> = {
      string: Type,
      address: Hash,
      bool: Box,
      default: ArrowRightCircle,
    };

    // Handle numeric types
    if (/^(u)?int(\d+)$/.test(typeName)) {
      return Hash;
    }

    // Handle array types
    if (typeName.includes("[]")) {
      return List;
    }

    return typeMap[typeName] || typeMap["default"];
  };

  const getTypeColor = (typeName: string) => {
    const colorMap: Record<string, string> = {
      string: "bg-blue-100 text-blue-800",
      address: "bg-purple-100 text-purple-800",
      bool: "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800",
    };

    // Handle numeric types
    if (/^(u)?int(8|16|32|64|128|256)$/.test(typeName)) {
      return "bg-yellow-100 text-yellow-800";
    }

    // Handle array types
    if (typeName.includes("[]")) {
      return "bg-red-100 text-red-800";
    }

    return colorMap[typeName] || colorMap["default"];
  };

  const Icon = getTypeIcon(type);
  const color = getTypeColor(type);

  return (
    <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center space-x-1 ${color}`}>
      <Icon className="w-3 h-3 align-center" />
      <span>{type}</span>
    </div>
  );
};

type TypedDataProps = {
  typedData: TypedDataDefinition;
};

export const TypedDataDisplay = ({ typedData }: TypedDataProps) => {
  const renderMessageValue = (value: unknown) => {
    if (Array.isArray(value)) {
      return (
        <div className="flex space-x-1 items-center">
          [
          {value.map((item, index) => (
            <span key={index} className="text-gray-600 dark:text-gray-400">
              {JSON.stringify(item)}
              {index !== value.length - 1 && ","}
            </span>
          ))}
          ]
        </div>
      );
    }

    if (typeof value === "string" && isAddress(value)) {
      return <Address address={value} />;
    }

    return JSON.stringify(value);
  };

  return (
    <div>
      <div className="card card-compact bg-base-300 mb-4 px-3">
        <div className="card-body gap-0">
          <h3 className="card-title">
            Message <TypeBadge type={typedData.primaryType} />
          </h3>
          {Object.entries(typedData.message).map(([key, value], i) => {
            const fieldType = typedData.types[typedData.primaryType].find(f => f.name === key)?.type || "unknown";

            return (
              <Fragment key={key}>
                {i !== 0 && <div className="divider my-0" />}
                <div className="flex justify-between items-center py-2 border-gray-200 overflow-x-auto">
                  <span className="font-medium text-gray-700 mr-8 dark:text-gray-300">{key}</span>
                  <div className="flex items-center space-x-2">
                    <TypeBadge type={fieldType} />
                    <span className="text-gray-600 dark:text-gray-400">{renderMessageValue(value)}</span>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="card card-compact bg-base-300 mb-4 px-3">
        <div className="card-body gap-0">
          <h3 className="card-title">Type Definitions</h3>
          {Object.entries(typedData.types).map(([typeName, typeDefinition]) => (
            <div key={typeName} className="mb-3">
              <div className="font-medium text-gray-600 dark:text-gray-400 mb-2">{typeName}</div>
              {typeDefinition?.map(field => (
                <div key={field.name} className="flex justify-between items-center px-4 py-1">
                  <span className="text-gray-700 dark:text-gray-300">{field.name}</span>
                  <TypeBadge type={field.type} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
