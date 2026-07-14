import { type SubmitEvent } from "react";
import clsx from "clsx";
import { Button } from "../ui";
import styles from "./styles.module.css";

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
      className={clsx(styles["price-filter"], className)}
      onSubmit={handleSubmit}
    >
      <fieldset>
        <legend className={styles["price-filter__legend"]}>Precio</legend>
        <div className={styles["price-filter__inputs"]}>
          <div className={styles["price-filter__field"]}>
            <label htmlFor="minPrice" className={styles["price-filter__label"]}>
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
          <div className={styles["price-filter__field"]}>
            <label htmlFor="maxPrice" className={styles["price-filter__label"]}>
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
      <Button
        type="submit"
        variant="secondary"
        size="xl"
        className={styles["price-filter__button"]}
      >
        Filtrar Productos
      </Button>
    </form>
  );
}
