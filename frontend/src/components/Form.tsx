import React, { useState } from "react";
import type { HouseFormData } from "../model/house";
import type { HouseImageFormData } from "../model/image";

const Form = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const newFiles = selectedFiles.concat(filesArray);

    if (newFiles.length > 10) {
      alert("You can only upload up to 10 images.");
      setSelectedFiles(newFiles.slice(0, 10));
    } else {
      setSelectedFiles(newFiles);
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const houseData: HouseFormData = {
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      flat: formData.get("flat") as string,
      address: formData.get("address") as string,
      mapAddress: formData.get("mapAddress") as string,
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      total_area: Number(formData.get("total_area")),
      living_area: Number(formData.get("living_area")),
      construction_year: Number(formData.get("construction_year")),
      garage: formData.get("garage") === "on",
      garden: formData.get("garden") === "on",
      pet: formData.get("pet") === "on",
      accesible: formData.get("accesible") === "on",
      heating: formData.get("heating") === "on",
      airConditioned: formData.get("airConditioned") === "on",
      furnished: formData.get("furnished") === "on",
      terrace: formData.get("terrace") === "on",
      active: formData.get("active") === "on",
      rentable: formData.get("rentable") === "on",
    };

    const PORT = import.meta.env.PUBLIC_API_PORT || 3001;

    const res = await fetch(`http://localhost:${PORT}/houses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(houseData),
    }).catch(() => {
      console.log("Error during posting house");
      alert("Error during posting house");
    });

    const house = res ? await res.json() : null;
    if (!house) {
      console.log("Failed to fetch house data");
      alert("Failed to fetch house data");
      return;
    }
    const houseId = house.id;

    // Paso 2: Subir imágenes a Cloudinary
    const uploadedImages: HouseImageFormData[] = [];

    for (const file of selectedFiles) {
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("image", file);
      cloudinaryForm.append("houseId", String(houseId));

      const uploadRes = await fetch(`http://localhost:${PORT}/images/${houseId}`, {
        method: "POST",
        body: cloudinaryForm,
      }).catch(() => {
        console.log("Error during posting images");
        alert("Error during posting images");
      });

      if (uploadRes && uploadRes.ok) {
        const uploaded = await uploadRes.json();
        uploadedImages.push({
          url: uploaded.url,
          alt: houseData.title,
          order_index: uploadedImages.length,
          houseId: houseId,
        });
      }
    }

    // Paso 3: Asociar imágenes a la casa
    if (uploadedImages.length > 0) {
      await fetch(`http://localhost:${PORT}/houses/${houseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: uploadedImages }),
      }).catch(() => {
        console.log("Error attaching images to house");
        alert("Error attaching images to house");
      });
    }

    console.log(houseData);
    console.log(selectedFiles);
    window.location.href = "/";
  };

  return (
    <form
      onSubmit={submit}
      className="p-6 grid gap-4"
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="title"
        placeholder="Nombre de la casa"
        required
        className="input bg-accent-600 textInput"
      />
      <input
        type="number"
        name="price"
        placeholder="Precio"
        required
        className="input bg-accent-600 textInput"
      />
      <textarea
        name="description"
        placeholder="Descripción"
        required
        className="input bg-accent-600 h-30 textInput"
      ></textarea>
      <input
        type="text"
        name="flat"
        placeholder="Planta"
        className="input bg-accent-600 textInput"
      />
      <input
        type="text"
        name="address"
        placeholder="Dirección"
        required
        className="input bg-accent-600 textInput"
      />
      <input
        type="text"
        name="mapAddress"
        placeholder="Dirección para mapa"
        required
        className="input bg-accent-600 textInput"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <input
        type="number"
        name="bedrooms"
        placeholder="Cuartos"
        required
        className="input bg-accent-600 textInputColumn"
      />
      <input
        type="number"
        name="bathrooms"
        placeholder="Baños"
        required
        className="input bg-accent-600 textInputColumn"
      />
      <input
        type="number"
        name="total_area"
        placeholder="Area Total (m²)"
        required
        className="input bg-accent-600 textInputColumn"
      />
      <input
        type="number"
        name="living_area"
        placeholder="Area Habitable (m²)"
        required
        className="input bg-accent-600 textInputColumn"
      />
      <input
        type="number"
        name="construction_year"
        placeholder="Año de construcción"
        required
        className="input bg-accent-600 textInputColumn"
      />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      <label className="checkbox">
        <input type="checkbox" name="pet"/>
        Mascota
      </label>
      <label className="checkbox">
        <input type="checkbox" name="accesible" />
        Accesible
      </label>
      <label className="checkbox">
        <input type="checkbox" name="furnished" />
        Amueblado
      </label>
      <label className="checkbox">
        <input type="checkbox" name="heating" />
        Calefacción
      </label>
      <label className="checkbox">
        <input type="checkbox" name="airConditioned" />
        Aire acondicionado
      </label>
      <label className="checkbox">
        <input type="checkbox" name="garage" />
        Garage
      </label>
      <label className="checkbox">
        <input type="checkbox" name="terrace" />
        Terrace
      </label>
      <label className="checkbox">
        <input type="checkbox" name="garden" />
        Jardín
      </label>
      <label className="checkbox">
        <input type="checkbox" name="active" />
        Active
      </label>
      <label className="checkbox font-extraboldxº">
        <input type="checkbox" name="rentable" />
        Rentable
      </label>
      </div>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        className="input bg-primary-500 p-2 cursor-pointer hover:bg-white"
        onChange={handleFileChange}
      />
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {selectedFiles.map((file, index) => {
            const url = URL.createObjectURL(file);
            return (
              <img
                key={index}
                src={url}
                alt={`preview-${index}`}
                className="w-full h-20 object-cover my-4"
                onLoad={() => URL.revokeObjectURL(url)}
              />
            );
          })}
        </div>
      )}
      <button
        type="submit"
        className=" bg-accent-400 text-white py-2 px-4 rounded hover:bg-white hover:text-black"
      >
        Create House
      </button>
    </form>
  );
};

export default Form;