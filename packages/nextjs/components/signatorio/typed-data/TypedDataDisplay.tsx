import { Fragment } from "react";
import { MessageField } from "./MessageField";
import { TypeBadge } from "./TypeBadge";
import { TypeDefinitions } from "./TypeDefinitions";
import { TypedDataDefinition } from "viem";

interface TypedDataProps {
  typedData: TypedDataDefinition;
}

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
      <TypeDefinitions types={typedData.types} />
    </div>
  );
};
