import { Fragment } from "react";
import { TypeBadge } from "./TypeBadge";
import { TypedDataDefinition, isAddress } from "viem";
import { Address } from "~~/components/scaffold-eth";

interface MessageFieldProps {
  name: string;
  value: unknown;
  type: string;
  types: TypedDataDefinition["types"];
  depth?: number;
}

export const MessageField = ({ name, value, type, types, depth = 0 }: MessageFieldProps) => {
  const isArray = type.endsWith("[]") && Array.isArray(value);
  const isStruct = type in types;

  const isPrimitive = !isArray && !isStruct;

  if (isPrimitive) {
    const renderValue = () => {
      if (typeof value === "string" && isAddress(value)) {
        return <Address address={value} />;
      }

      return JSON.stringify(value);
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center py-2 border-gray-200 overflow-x-auto">
          <span className="font-medium text-gray-700 mr-8 dark:text-gray-300">{name}</span>
          <div className="flex items-center space-x-2">
            <TypeBadge type={type} />
            <span className="text-gray-600 dark:text-gray-400">{renderValue()}</span>
          </div>
        </div>
      </div>
    );
  }

  if (isStruct) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center py-2 border-gray-200 overflow-x-auto">
          <span className="font-medium text-gray-700 mr-8 dark:text-gray-300">{name}</span>
          <div className="flex items-center space-x-2">
            <TypeBadge type={type} />
          </div>
        </div>

        <div style={{ paddingLeft: `${(depth + 1) * 1.5}rem` }}>
          {types[type].map((field, index) => (
            <Fragment key={field.name}>
              {index !== 0 && <div className="divider my-0" />}
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
      </div>
    );
  }

  if (isArray) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center py-2 border-gray-200 overflow-x-auto">
          <span className="font-medium text-gray-700 mr-8 dark:text-gray-300">{name}</span>
          <div className="flex items-center space-x-2">
            <TypeBadge type={type} />
          </div>
        </div>

        <div style={{ paddingLeft: `${(depth + 1) * 1.5}rem` }}>
          {value.map((item, index) => (
            <Fragment key={index}>
              {index !== 0 && <div className="divider my-0" />}
              <MessageField
                key={index}
                name={`[${index.toString()}]`}
                value={item}
                type={type.slice(0, -2)}
                types={types}
                depth={depth + 1}
              />
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
