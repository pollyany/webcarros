import { ChangeEvent, useState, useContext, useEffect } from "react";

import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { v4 as uuidV4 } from "uuid";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import { db, storage } from "../../../../services/firebaseConnection";
import { formatPrice } from "../../../../hooks/maskPrice";
import DashboardHeader from "../../../../components/admin/panelHeader";
import Container from "../../../../components/container";
import Input from "../../../../components/admin/input";
import InputCurrency from "../../../../components/admin/inputCurrency";
import InputFormated from "../../../../components/admin/inputFormated";
import Select from "../../../../components/admin/select";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  model: z.string().min(1, "O modelo é obrigatório"),
  color: z.string().min(1, "A cor do veículo é obrigatória"),
  year: z.string().min(1, "O Ano do veículo é obrigatório"),
  km: z.string().min(1, "O KM do veículo é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  whatsapp: z
    .string()
    .min(2, "O Telefone é obrigatório")
    .refine((value) => /^\(\d{2}\) \d{5}-\d{4}$/.test(value), {
      message: "Número de telefone inválido.",
    }),
  description: z.string().min(1, "A descrição é obrigatória"),
  destaque: z.string().min(1, "Em destaque é obrigatório."),
});

type FormData = z.infer<typeof schema>;

interface ImageItemProps {
  name: string;
  url: string;
}

export default function Edit() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);
  const [price, setPrice] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        navigate("/dashboard");
        return;
      }

      const carData = snapshot.data();

      reset({
        name: carData?.name,
        year: carData?.year,
        city: carData?.city,
        model: carData?.model,
        color: carData?.color,
        description: carData?.description,
        destaque: carData?.destaque,
        whatsapp: carData?.whatsapp,
        km: carData?.km,
      });

      const formattedPrice = formatPrice(parseFloat(carData?.price));
      setPrice(formattedPrice);
      setCarImages(carData?.images || []);
    }

    loadCar();
  }, [id]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        await handleUpload(image);
      } else {
        alert("Envie uma imagem jpeg ou png!");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${uidImage}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };

        setCarImages((images) => [...images, imageItem]);
        toast.success("Imagem cadastrada com sucesso!");
      });
    });
  }

  async function onSubmit(data: FormData) {
    const priceNumericValue = parseFloat(price.replace(/\D/g, ""));
    const isPriceEmpty = !price.trim();
    const isPriceZero = priceNumericValue === 0;

    if (isPriceEmpty) {
      toast.error("O preço do veículo é obrigatório.");
      return;
    }

    if (isPriceZero) {
      toast.error("O preço do veículo deve ser maior que zero.");
      return;
    }

    if (carImages.length === 0) {
      toast.error("Envie pelo meno 1 imagem!");
      return;
    }

    const carListImages = carImages.map((car) => {
      return {
        name: car.name,
        url: car.url,
      };
    });

    const carRef = doc(db, "cars", id as string);

    await updateDoc(carRef, {
      name: data.name.toUpperCase(),
      model: data.model,
      whatsapp: data.whatsapp,
      city: data.city,
      year: data.year,
      color: data.color,
      km: data.km,
      price: priceNumericValue,
      description: data.description,
      destaque: data.destaque,
      images: carListImages,
    })
      .then(() => {
        reset();
        setCarImages([]);
        setPrice("");
        navigate("/dashboard");
        toast.success("Veículo atualizado com sucesso!");
      })
      .catch((error) => {
        console.log("Erro ao atualizar o veículo:", error);
        toast.error("Erro ao atualizar veículo.");
      });
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((car) => car.url !== item.url));
    } catch {
      console.log("ERRO AO DELETAR");
    }
  }

  return (
    <Container>
      <DashboardHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.url}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do veículo"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2 mb-4">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <div className="w-full">
              <p className="mb-2 font-medium">Nome do veículo</p>
              <Input
                type="text"
                register={register}
                name="name"
                error={errors.name?.message}
                placeholder="Ex: Onix 1.0..."
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Modelo do veículo</p>
              <Input
                type="text"
                register={register}
                name="model"
                error={errors.model?.message}
                placeholder="Ex: 1.0 Flex PLUS MANUAL..."
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Cor</p>
              <Input
                type="text"
                register={register}
                name="color"
                error={errors.color?.message}
                placeholder="Ex: Azul..."
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2016/2016..."
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">KM rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.900..."
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-start gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Preço</p>
              <InputCurrency
                name="price"
                placeholder="Ex: R$ 69.000..."
                idCar={id}
                value={price}
                onChange={(formattedPrice) => setPrice(formattedPrice)}
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Em destaque?</p>
              <Select
                name="destaque"
                register={register}
                error={errors.destaque?.message}
                options={[
                  { value: "S", label: "Sim" },
                  { value: "N", label: "Não" },
                ]}
              />
            </div>
          </div>
          <div className="flex w-full mb-3 flex-row items-start gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Campo Grande - MS..."
              />
            </div>
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / Whatsapp</p>
              <InputFormated
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: (99) 99999-9999"
                mask="(99) 99999-9999"
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o veículo..."
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gray-800 text-white font-medium h-10"
          >
            Atualizar
          </button>
        </form>
      </div>
    </Container>
  );
}
