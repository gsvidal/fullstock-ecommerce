import { type SubmitEvent } from "react";
import { Button } from "./ui";
import { cn } from "../lib/cn";

type PriceFilterProps = {
  className?: string;
  defaultMinPrice?: string;
  defaultMaxPrice?: string;
  onFilter: (formData: FormData) => void;
};

export default function PriceFilter({
  className,
  defaultMinPrice,
  defaultMaxPrice,
  onFilter,
}: PriceFilterProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onFilter(new FormData(event.currentTarget));
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
    >
      <fieldset>
        <legend className="mb-4 text-base font-medium">Precio</legend>
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="minPrice" className="text-sm font-medium">
              Min
            </label>
            <input
              id="minPrice"
              type="number"
              name="minPrice"
              min="0"
              step="0.01"
              defaultValue={defaultMinPrice}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxPrice" className="text-sm font-medium">
              Max
            </label>
            <input
              id="maxPrice"
              type="number"
              name="maxPrice"
              min="0"
              step="0.01"
              defaultValue={defaultMaxPrice}
            />
          </div>
        </div>
      </fieldset>
      <Button type="submit" variant="secondary" size="xl" className="w-full">
        Filtrar Productos
      </Button>
    </form>
  );
}
