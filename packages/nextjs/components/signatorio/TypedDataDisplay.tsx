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

    if (/^(u)?int(\d+)$/.test(typeName)) {
      return Hash;
    }

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

    if (/^(u)?int(8|16|32|64|128|256)$/.test(typeName)) {
      return "bg-yellow-100 text-yellow-800";
    }

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

const MessageField = ({
  name,
  value,
  type,
  types,
  depth = 0,
}: {
  name: string;
  value: unknown;
  type: string;
  types: TypedDataDefinition["types"];
  depth?: number;
}) => {
  // Check if the type is a struct type (exists in types definition)
  const isStruct = type in types;

  // Handle arrays of structs
  const isArrayType = type.endsWith("[]");
  const baseType = isArrayType ? type.slice(0, -2) : type;
  const isArrayOfStructs = isArrayType && baseType in types;

  const renderValue = () => {
    // Handle arrays
    if (Array.isArray(value)) {
      if (isArrayOfStructs) {
        return (
          <div className="flex flex-col space-y-2">
            {value.map((item, index) => (
              <div key={index} className="ml-4">
                <div className="text-gray-600 dark:text-gray-400">[{index}]</div>
                <div className="border-l-2 border-base-200">
                  {types[baseType].map((field, fieldIndex) => (
                    <Fragment key={field.name}>
                      {fieldIndex !== 0 && <div className="divider my-0" />}
                      <MessageField
                        name={field.name}
                        value={item[field.name]}
                        type={field.type}
                        types={types}
                        depth={depth + 1}
                      />
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="flex space-x-1 items-center whitespace-nowrap">
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

    // Handle addresses
    if (typeof value === "string" && isAddress(value)) {
      return <Address address={value} />;
    }

    // Handle primitive values
    if (!isStruct) {
      return JSON.stringify(value);
    }

    return null;
  };

  const paddingLeft = `${depth * 1.5}rem`;

  return (
    <div className="w-full" style={{ paddingLeft }}>
      <div className="flex justify-between items-center py-2 border-gray-200 overflow-x-auto">
        <span className="font-medium text-gray-700 mr-8 dark:text-gray-300">{name}</span>
        <div className="flex items-center space-x-2">
          <TypeBadge type={type} />
          {!isStruct && <span className="text-gray-600 dark:text-gray-400">{renderValue()}</span>}
        </div>
      </div>

      {isStruct && value && typeof value === "object" ? (
        <>
          <div className="border-l-2 border-base-200 ml-4">
            {types[type].map((field, index) => (
              <Fragment key={field.name}>
                {index !== 0 && <div className="divider my-0" style={{ paddingLeft }} />}
                <MessageField
                  name={field.name}
                  value={(value as any)[field.name]}
                  type={field.type}
                  types={types}
                  depth={depth + 1}
                />
              </Fragment>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export const TypedDataDisplay = ({ typedData }: TypedDataProps) => {
  return (
    <div>
      <div className="card card-compact bg-base-300 mb-4 px-3">
        <div className="card-body gap-0">
          <h3 className="card-title">
            Message <TypeBadge type={typedData.primaryType} />
          </h3>
          {typedData.types[typedData.primaryType].map((field, index) => (
            <Fragment key={field.name}>
              {index !== 0 && <div className="divider my-0" />}
              <MessageField
                name={field.name}
                value={typedData.message[field.name]}
                type={field.type}
                types={typedData.types}
              />
            </Fragment>
          ))}
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
