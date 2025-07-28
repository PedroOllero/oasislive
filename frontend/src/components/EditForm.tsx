import React, { useState, useEffect } from "react";
import type { House, HouseFormData } from "../model/house";
import type { HouseImageFormData } from "../model/image";

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
      id: houseData.id,
      title: formData.get("title") as string,
      price: Number(formData.get("price")),
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      total_area: Number(formData.get("total_area")),
      living_area: Number(formData.get("living_area")),
      construction_year: Number(formData.get("construction_year")),
      garage: formData.get("garage") === "on",
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
            ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) }
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
      className="max-w-2xl mx-auto mt-10 p-6 bg-accent-500 shadow-md rounded-lg grid gap-4"
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="title"
        placeholder="Nombre de la casa"
        required
        className="input"
        defaultValue={houseData.title}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        required
        className="input"
        defaultValue={houseData.price}
      />
      <textarea
        name="description"
        placeholder="Description"
        required
        className="input"
        defaultValue={houseData.description}
      ></textarea>
      <input
        type="text"
        name="address"
        placeholder="Address"
        required
        className="input"
        defaultValue={houseData.address}
      />
      <input
        type="number"
        name="bedrooms"
        placeholder="Bedrooms"
        required
        className="input"
        defaultValue={houseData.bedrooms}
      />
      <input
        type="number"
        name="bathrooms"
        placeholder="Bathrooms"
        required
        className="input"
        defaultValue={houseData.bathrooms}
      />
      <input
        type="number"
        name="total_area"
        placeholder="Total Area (m²)"
        required
        className="input"
        defaultValue={houseData.total_area}
      />
      <input
        type="number"
        name="living_area"
        placeholder="Living Area (m²)"
        required
        className="input"
        defaultValue={houseData.living_area}
      />
      <input
        type="number"
        name="construction_year"
        placeholder="Construction Year"
        required
        className="input"
        defaultValue={houseData.construction_year}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="garage"
          defaultChecked={houseData.garage}
        />
        Garage
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="terrace"
          defaultChecked={houseData.terrace}
        />
        Terrace
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="active"
          defaultChecked={houseData.active}
        />
        Active
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="rentable"
          defaultChecked={houseData.rentable}
        />
        Rentable
      </label>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        className="input bg-red-400"
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
        className="bg-accent-400 text-white py-2 px-4 rounded hover:bg-white hover:text-black"
      >
        Update House
      </button>
    </form>
  );
};

export default EditForm;
