import { Link } from "react-router-dom";
import {
  FaClock,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="flex flex-col justify-between flex-1 text-gray-300">
              <p className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-gray-300 flex-shrink-0" />
                <span>
                  <span className="text-gray-300">Endereço:</span>
                  <span className="block text-gray-300">
                    Rua Exemplo, 123 - Cidade, Estado
                  </span>
                </span>
              </p>
              <p className="flex items-center space-x-3">
                <FaPhone className="text-gray-300 flex-shrink-0" />
                <span>
                  <span className="text-gray-300">Telefones:</span>
                  <span className="block text-gray-300">(11) 1234-5678</span>
                  <span className="block text-gray-300">(11) 98765-4321</span>
                </span>
              </p>
              <p className="flex items-center space-x-3">
                <FaClock className="text-gray-300 flex-shrink-0" />
                <span>
                  <span className="text-gray-300">Atendimento:</span>
                  <span className="block text-gray-300">
                    Segunda à Sexta: 9h às 18h
                  </span>
                  <span className="block text-gray-300">Sábado: 9h às 13h</span>
                </span>
              </p>
            </div>
          </div>

          {/* Coluna de Navegação e Redes Sociais */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4">Navegação</h3>
              <nav>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="flex items-center group">
                      <span className="h-1 bg-gray-300 rounded-full mr-2 transition-all duration-200 w-2"></span>
                      <span className="text-gray-300 hover:text-white transition-colors duration-200">
                        Home
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/veiculos" className="flex items-center group">
                      <span className="h-1 bg-gray-300 rounded-full mr-2 transition-all duration-200 w-2"></span>
                      <span className="text-gray-300 hover:text-white transition-colors duration-200">
                        Veículos
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/localizacao" className="flex items-center group">
                      <span className="h-1 bg-gray-300 rounded-full mr-2 transition-all duration-200 w-2"></span>
                      <span className="text-gray-300 hover:text-white transition-colors duration-200">
                        Localização
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contato" className="flex items-center group">
                      <span className="h-1 bg-gray-300 rounded-full mr-2 transition-all duration-200 w-2"></span>
                      <span className="text-gray-300 hover:text-white transition-colors duration-200">
                        Contato
                      </span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 p-3 rounded-full hover:bg-blue-500 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 p-3 rounded-full hover:bg-pink-500 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://wa.me/5511987654321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700 p-3 rounded-full hover:bg-green-500 transition-colors duration-200"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4">Fale Conosco</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nome"
                    className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-gray-500 text-gray-300 placeholder-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Telefone"
                    className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-gray-500 text-gray-300 placeholder-gray-400"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Mensagem"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:border-gray-500 text-gray-300 placeholder-gray-400 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-md transition-colors duration-200 border border-gray-600"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 my-8"></div>

        <div className="text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} WebCarros. Todos os direitos
            reservados.
          </p>
          <p className="mt-2">CNPJ: 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}
