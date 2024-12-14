import { TypeBadge } from "./TypeBadge";
import { TypedDataDefinition } from "viem";

interface TypeDefinitionsProps {
  types: TypedDataDefinition["types"];
}

export const TypeDefinitions = ({ types }: TypeDefinitionsProps) => {
  return (
    <div className="card card-compact bg-base-300 mb-4 px-3">
      <div className="card-body gap-0">
        <h3 className="card-title">Type Definitions</h3>
        {Object.entries(types).map(([typeName, typeDefinition]) => (
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
  );
};
