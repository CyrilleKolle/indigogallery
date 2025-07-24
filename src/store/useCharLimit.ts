import { useState, useCallback } from "react";

export function useCharLimit(max: number) {
  const [value, setValue]   = useState("");
  const [error, setError]   = useState<string | null>(null);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      setValue(v);
      setError(v.length > max ? `Limit of ${max} characters reached` : null);
    },
    [max]
  );

  return { value, onChange, error, length: value.length, setValue };
}
