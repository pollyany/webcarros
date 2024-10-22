import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <h1 className="font-bold text-6xl mb-2">404</h1>
      <h1 className="font-bold text-4xl mb-4">Página não encontrada</h1>
      <p className="italic text-1xl mb-4">
        Você caiu em uma página que não existe!
      </p>

      <Link to="/" className="bg-gray-900 text-white py-1 px-4 rounded-md">
        Voltar para home
      </Link>
    </div>
  );
}
