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
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { CarsProps } from "../cars";
import Banner from "../../assets/banner.avif";

export default function Home() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [sliderPerView, setSliderPerView] = useState<number>(3);

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else if (window.innerWidth < 1024) {
        setSliderPerView(2);
      } else {
        setSliderPerView(3);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(
      carsRef,
      where("destaque", "==", "S"),
      orderBy("created", "desc")
    );

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

  return (
    <>
      <img src={Banner} className="w-full h-auto mt-16" alt="Banner"/>
      <Container >
        <main>
          <h1 className="font-bold mx-auto mt-6 text-3xl mb-4 border-b pb-1 border-gray-300 w-fit">
            Destaques
          </h1>
          {loadingCars && (
            <div className="w-full flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
            </div>
          )}
          <Swiper
            slidesPerView={sliderPerView}
            autoplay={{
              delay: 299000,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            loop={true}
            navigation
            pagination={{
              clickable: true,
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
            }}
            modules={[Pagination, Navigation, Autoplay]}
          >
            {cars.map((car) => (
              <SwiperSlide key={car.id} className="mb-8 select-none">
                <section className="w-full bg-white overflow-hidden rounded-lg">
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
              </SwiperSlide>
            ))}
          </Swiper>
        </main>

        {cars.length < 1 && !loadingCars && (
          <h1 className="font-bold text-center mt-6 text-2xl mb-4">
            O sistema ainda não possui nenhum veículo cadastrado :/
          </h1>
        )}
      </Container>
    </>
  );
}
