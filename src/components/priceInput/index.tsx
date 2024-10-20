import { useEffect, useState } from "react";
import { formatPrice } from "../../hooks/maskPrice";

interface PriceInputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PriceInput({
  name,
  placeholder,
  value,
  onChange,
}: PriceInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [getValue, setGetValue] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value && !getValue){
      setInputValue(value)
      setGetValue(true)
    }
  }, [value])


  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, "");

    if (value.trim() === "") {
      setInputValue("");
      onChange("");
      setError("O preço é obrigatório e não pode ser vazio.");
      return;
    }

    const formattedValue = formatPrice(parseFloat(numericValue));

    setInputValue(formattedValue);
    onChange(numericValue);

    const priceValue = parseFloat(numericValue);
    if (priceValue === 0) {
      setError("O preço é obrigatório e não pode ser zero.");
    } else {
      setError(null);
    }
  };

  const handleFocus = () => {
    if (inputValue === "") {
      setInputValue("R$ 0,00");
    }
  };

  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-2"
        placeholder={placeholder}
        type="text"
        value={inputValue}
        onChange={handlePriceChange}
        onFocus={handleFocus}
        id={name}
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
}
