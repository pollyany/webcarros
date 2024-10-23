import { useState, useEffect } from "react";
import Container from "../../components/container";
import { Link } from "react-router-dom";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { formatPrice } from "../../hooks/maskPrice";
import {
  MdOutlineCalendarMonth,
  MdOutlineColorLens,
  MdOutlineSpeed,
} from "react-icons/md";

interface CarsProps {
  id: string;
  name: string;
  year: string;
  price: number;
  city: string;
  color: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  url: string;
}

export default function Cars() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loadingCars, setLoadingCars] = useState(true);

  useEffect(() => {
    loadCars();
  }, []);

  function loadCars() {
    setIsSearching(false);
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot) => {
      const listcars = [] as CarsProps[];

      snapshot.forEach((doc) => {
        listcars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          color: doc.data()?.color,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
        });
      });

      setCars(listcars);
      setLoadingCars(false);
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchCar() {
    if (input === "") {
      loadCars();
      return;
    }

    setIsSearching(true);
    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    const listcars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listcars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        color: doc.data()?.color,
        images: doc.data().images,
      });
    });

    setCars(listcars);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg  w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Qual veículo você está buscando?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={cars.length < 1 && !isSearching}
        />
        <button
          type="button"
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearchCar}
          disabled={cars.length < 1 && !isSearching}
        >
          Buscar
        </button>
      </section>

      {cars.length > 0 && (
        <>
          {" "}
          <h1 className="font-bold text-center mt-6 text-2xl mb-4">
            Os melhores veículos para você
          </h1>
          <main className="grid gird-cols-1 gap-6 mb-4 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <section
                key={car.id}
                className="w-full bg-white overflow-hidden rounded-lg"
              >
                <div
                  className="w-full h-72 rounded-lg mb-2 bg-slate-200"
                  style={{
                    display: loadImages.includes(car.id) ? "none" : "block",
                  }}
                ></div>
                <Link to={`/veiculos/${car.id}`}>
                  <img
                    className="w-full rounded-lg mb-2 h-72 object-cover max-h-72 hover:scale-105 transition-all"
                    src={car.images[0].url}
                    alt="Veículo"
                    onLoad={() => handleImageLoad(car.id)}
                    style={{
                      display: loadImages.includes(car.id) ? "block" : "none",
                    }}
                  />
                </Link>
                <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                <div className="flex flex-col px-2">
                  <span className="text-zinc-700 mb-6 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MdOutlineColorLens /> {car.color} |
                    </span>

                    <span className="flex items-center gap-1">
                      <MdOutlineCalendarMonth /> {car.year} |
                    </span>

                    <span className="flex items-center gap-1">
                      <MdOutlineSpeed /> {car.km} KM
                    </span>
                  </span>
                  <strong className="text-black font-medium text-xl">
                    {formatPrice(car.price)}
                  </strong>
                </div>

                <div className="w-full h-px bg-slate-200 my-2"></div>

                <div className="px-2 pb-2 flex justify-between">
                  <span className="text-black">{car.city}</span>
                  <Link
                    to={`/veiculos/${car.id}`}
                    className="bg-red-500 text-white h-8 px-6 rounded-md font-medium text-base flex items-center justify-center"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </section>
            ))}
          </main>
        </>
      )}

      {cars.length < 1 && !loadingCars && (
        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          {isSearching
            ? "Nenhum veículo encontrado com os critérios de busca."
            : "O sistema ainda não possui nenhum veículo cadastrado :/"}
        </h1>
      )}

      {loadingCars && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}
    </Container>
  );
}
