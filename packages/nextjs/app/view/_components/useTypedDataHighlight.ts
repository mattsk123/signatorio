import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { TypedDataDefinition } from "viem";

export const useTypedDataHighlight = (typedData: TypedDataDefinition | null) => {
  const [highlightedTypedData, setHighlightedTypedData] = useState<string | null>(null);

  useEffect(() => {
    if (!typedData) return;

    const highlightTypedData = async () => {
      const html = await codeToHtml(JSON.stringify(typedData, null, 2), {
        lang: "json",
        themes: { light: "min-light", dark: "nord" },
      });
      setHighlightedTypedData(html);
    };

    highlightTypedData();
  }, [typedData]);

  return highlightedTypedData;
};
