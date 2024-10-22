import { RegisterOptions, UseFormRegister } from "react-hook-form";
import InputMask from "react-input-mask-next";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  mask: string;
}

export default function InputFormated({
  name,
  placeholder,
  register,
  rules,
  type,
  error,
  mask,
}: InputProps) {
  return (
    <div>
      <InputMask
        type={type}
        maskPlaceholder={null}
        className="w-full border-2 rounded-md h-11 px-2"
        placeholder={placeholder}
        id={name}
        {...register(name, rules)}
        mask={mask}
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
}
