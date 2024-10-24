import logoImg from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Header() {
  const location = useLocation();

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow fixed top-0">
      <header className="flex h-full w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to="/" className="h-[70%]">
          <img src={logoImg} alt="Logo do site" className="max-h-full" />
        </Link>

        <nav className="flex items-center space-x-8">
          <Link
            to="/"
            className={`relative text-lg font-semibold text-gray-900 transition duration-300 before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-full before:bg-gray-300 before:origin-center before:transition-transform before:duration-300 ${
              location.pathname === "/"
                ? "before:scale-x-100"
                : "before:scale-x-0"
            } hover:before:scale-x-100`}
          >
            Home
          </Link>
          <Link
            to="/veiculos"
            className={`relative text-lg font-semibold text-gray-900 transition duration-300 before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-full before:bg-gray-300 before:origin-center before:transition-transform before:duration-300 ${
              location.pathname === "/veiculos"
                ? "before:scale-x-100"
                : "before:scale-x-0"
            } hover:before:scale-x-100`}
          >
            Veículos
          </Link>
          <Link
            to="/sobre"
            className={`relative text-lg font-semibold text-gray-900 transition duration-300 before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-full before:bg-gray-300 before:origin-center before:transition-transform before:duration-300 ${
              location.pathname === "/sobre"
                ? "before:scale-x-100"
                : "before:scale-x-0"
            } hover:before:scale-x-100`}
          >
            Localização
          </Link>
          <Link
            to="/contato"
            className={`relative text-lg font-semibold text-gray-900 transition duration-300 before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-full before:bg-gray-300 before:origin-center before:transition-transform before:duration-300 ${
              location.pathname === "/contato"
                ? "before:scale-x-100"
                : "before:scale-x-0"
            } hover:before:scale-x-100`}
          >
            Contato
          </Link>

          <div className="flex gap-2">
            <a
              href={`https://api.whatsapp.com/send?phone=(91) 98843-8387&text=Olá!`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={26} color="#1f2937" />
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=(91) 98843-8387&text=Olá!`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={26} color="#1f2937" />
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=(91) 98843-8387&text=Olá!`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={26} color="#1f2937" />
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}
