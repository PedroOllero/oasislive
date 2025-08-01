import React, { useState, useEffect } from "react";
import type { House, HouseFormData } from "../model/house";
import type { HouseImageFormData } from "../model/image";
import ModifyButton from "./ModifyButton";

export const EditForm = ({ houseId }: { houseId: number }) => {
  const [houseData, setHouseData] = useState<House | null>(null);
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
      console.log(selectedFiles);
    }
  };

  useEffect(() => {
    const fetchHouseData = async () => {
      try {
        const id = houseId;
        const API_URL =
          import.meta.env.PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${API_URL}/houses/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch house data");
        }
        const data = await res.json();
        setHouseData(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load house data");
      }
    };
    fetchHouseData();
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!houseData) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const updatedHouseData: HouseFormData = {
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

    const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";

    const res = await fetch(`${API_URL}/houses/${houseData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedHouseData),
    }).catch(() => {
      console.log("Error during updating house");
      alert("Error during updating house");
    });

    const house = res ? await res.json() : null;
    if (!house) {
      console.log("Failed to fetch house data");
      alert("Failed to fetch house data");
      return;
    }

    // Paso 2: Subir imágenes a Cloudinary
    const uploadedImages: HouseImageFormData[] = [];

    for (const file of selectedFiles) {
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("image", file);
      cloudinaryForm.append("houseId", String(houseId));

      const uploadRes = await fetch(`${API_URL}/images/${houseId}`, {
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
          alt: updatedHouseData.title,
          order_index: uploadedImages.length,
          houseId: houseId,
        });
      }
    }

    // Paso 3: Asociar imágenes a la casa
    if (uploadedImages.length > 0) {
      await fetch(`${API_URL}/houses/${houseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: uploadedImages }),
      }).catch(() => {
        console.log("Error attaching images to house");
        alert("Error attaching images to house");
      });
    }

    console.log(updatedHouseData);
    console.log(selectedFiles);
    window.location.href = "/edit";
  };

  // Nueva función para eliminar imagen
  const handleDeleteImage = async (imageId: number) => {
    const API_URL = "http://localhost:3001";
    try {
      const res = await fetch(`${API_URL}/images/${imageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHouseData((prev) =>
          prev
            ? {
                ...prev,
                images: prev.images.filter((img) => img.id !== imageId),
              }
            : null
        );
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete image");
    }
  };

  if (!houseData) {
    return <div>Loading...</div>;
  }

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
        defaultValue={houseData.title}
      />
      <input
        type="number"
        name="price"
        placeholder="Precio"
        required
        className="input bg-accent-600 textInput"
        defaultValue={houseData.price}
      />
      <textarea
        name="description"
        placeholder="Descripción"
        required
        className="input bg-accent-600 h-50 textInput"
        defaultValue={houseData.description}
      ></textarea>
      <input
        type="text"
        name="flat"
        placeholder="Planta"
        className="input bg-accent-600 textInput"
        defaultValue={houseData.flat}
      />
      <input
        type="text"
        name="address"
        placeholder="Dirección"
        required
        className="input bg-accent-600 textInput"
        defaultValue={houseData.address}
      />
      <input
        type="text"
        name="mapAddress"
        placeholder="Dirección para mapa"
        required
        className="input bg-accent-600 textInput"
        defaultValue={houseData.mapAddress}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          required
          className="input bg-accent-600 textInputColumn"
          defaultValue={houseData.bedrooms}
        />
        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          required
          className="input bg-accent-600 textInputColumn"
          defaultValue={houseData.bathrooms}
        />
        <input
          type="number"
          name="total_area"
          placeholder="Total Area (m²)"
          required
          className="input bg-accent-600 textInputColumn"
          defaultValue={houseData.total_area}
        />
        <input
          type="number"
          name="living_area"
          placeholder="Living Area (m²)"
          required
          className="input bg-accent-600 textInputColumn"
          defaultValue={houseData.living_area}
        />
        <input
          type="number"
          name="construction_year"
          placeholder="Construction Year"
          required
          className="input bg-accent-600 textInputColumn"
          defaultValue={houseData.construction_year}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <label className="checkbox">
          <input type="checkbox" name="pet" defaultChecked={houseData.pet} />
          Mascota
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="accesible"
            defaultChecked={houseData.accesible}
          />
          Accesible
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="furnished"
            defaultChecked={houseData.furnished}
          />
          Amueblado
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="heating"
            defaultChecked={houseData.heating}
          />
          Calefacción
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="airConditioned"
            defaultChecked={houseData.airConditioned}
          />
          Aire acondicionado
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="garage"
            defaultChecked={houseData.garage}
          />
          Garage
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="terrace"
            defaultChecked={houseData.terrace}
          />
          Terrace
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="garden"
            defaultChecked={houseData.garden}
          />
          Jardín
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="active"
            defaultChecked={houseData.active}
          />
          Active
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            name="rentable"
            defaultChecked={houseData.rentable}
          />
          Rentable
        </label>
      </div>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        className="input bg-accent-700 p-4 lg:p-2 text-4xl lg:text-base cursor-pointer hover:bg-white rounded-md"
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
                className="w-full h-20 object-cover rounded"
                onLoad={() => URL.revokeObjectURL(url)}
              />
            );
          })}
        </div>
      )}
      {houseData.images && houseData.images.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {houseData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="bg-accent-400 text-white p-4 lg:p-2 text-4xl lg:text-base rounded hover:bg-white hover:text-black"
      >
        Update House
      </button>
    </form>
  );
};

export default EditForm;
