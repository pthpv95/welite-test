"use client";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { ChangeEventHandler } from "react";

function SearchBox({ searchTerm }: { searchTerm: string }) {
  const router = useRouter();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    router.push(`/?searchTerm=${e.target.value}`);
  };

  const debouncedOnChange = debounce(onChange, 500);

  return (
    <div className="mb-3">
      <Input
        defaultValue={searchTerm}
        placeholder="Input book title"
        onChange={debouncedOnChange}
      />
    </div>
  );
}

export default SearchBox;
