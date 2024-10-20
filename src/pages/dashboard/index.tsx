import { useEffect, useState, useContext } from "react";
import Container from "../../components/container";
import DashboardHeader from "../../components/panelHeader";

import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { AiFillEdit } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";
import { Link } from "react-router-dom";

interface CarProps {
  id: string;
  name: string;
  year: string;
  price: string | number;
  city: string;
  km: string;
  images: ImageCarProps[];
}

interface ImageCarProps {
  name: string;
  url: string;
}

export default function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const { user } = useContext(AuthContext);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingCars, setLoadingCars] = useState(true);

  useEffect(() => {
    loadCars();
  }, [user]);

  function loadCars() {
    if (!user?.uid) {
      return;
    }

    setIsSearching(false);
    const carsRef = collection(db, "cars");

    getDocs(carsRef).then((snapshot) => {
      const listcars = [] as CarProps[];

      snapshot.forEach((doc) => {
        listcars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          km: doc.data().km,
          city: doc.data().city,
          price: doc.data().price,
          images: doc.data().images,
        });
      });

      setCars(listcars);
      setLoadingCars(false);
    });
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
    const listcars = [] as CarProps[];

    querySnapshot.forEach((doc) => {
      listcars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
      });
    });

    setCars(listcars);
  }

  async function handleDeleteCar(id: string) {
    const docRef = doc(db, "cars", id);
    await deleteDoc(docRef);
    setCars(cars.filter((car) => car.id !== id));
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  return (
    <Container>
      <DashboardHeader />
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Qual veículo você está buscando?"
          value={input}
          disabled={cars.length < 1 && !isSearching}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-red-500  h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearchCar}
          disabled={cars.length < 1 && !isSearching}
        >
          Buscar
        </button>
      </section>
      {cars.length > 0 && (
        <>
          <h1 className="font-bold text-center mt-6 text-2xl mb-4">
            Administração
          </h1>

          <main className="grid gird-cols-1 gap-6 mb-4 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <section
                key={car.id}
                className="w-full bg-white rounded-lg relative"
              >
                <div
                  className="w-full h-72 rounded-lg mb-2 bg-slate-200"
                  style={{
                    display: loadImages.includes(car.id) ? "none" : "block",
                  }}
                ></div>
                <img
                  className="w-full rounded-lg object-cover h-72 mb-2 max-h-72"
                  onLoad={() => handleImageLoad(car.id)}
                  style={{
                    display: loadImages.includes(car.id) ? "block" : "none",
                  }}
                  src={car.images[0].url}
                />
                <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

                <div className="flex flex-col px-2">
                  <span className="text-zinc-700">
                    Ano {car.year} | {car.km} km
                  </span>
                  <strong className="text-black font-bold mt-4">
                    R$ {car.price}
                  </strong>
                </div>

                <div className="w-full h-px bg-slate-200 my-2"></div>
                <div className="px-2 pb-2">
                  <span className="text-black">{car.city}</span>
                  <Link
                    to={`edit/${car.id}`}
                    className="absolute right-12 bottom-1 bg-white w-9 h-8 rounded-md flex items-center justify-center drop-shadow"
                  >
                    <AiFillEdit size={22} color="#2553d1" />
                  </Link>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="absolute right-2 bottom-1 bg-white w-9 h-8 rounded-md flex items-center justify-center drop-shadow"
                  >
                    <IoMdTrash size={24} color="#d12525" />
                  </button>
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
