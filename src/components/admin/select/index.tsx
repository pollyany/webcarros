import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  options: { value: string; label: string }[];
}

export default function Select({
  name,
  register,
  rules,
  error,
  options,
}: SelectProps) {
  return (
    <div>
      <select
        {...register(name, rules)}
        className="w-full border-2 rounded-md h-11 px-2"
      >
        <option value="" selected disabled>
          Selecione uma opção
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
}
