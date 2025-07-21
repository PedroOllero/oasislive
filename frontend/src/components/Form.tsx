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
      className="max-w-2xl mx-auto mt-10 p-6 bg-accent-300 shadow-md rounded-lg grid gap-4"
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="title"
        placeholder="Nombre de la casa"
        required
        className="input"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        required
        className="input"
      />
      <textarea
        name="description"
        placeholder="Description"
        required
        className="input"
      ></textarea>
      <input
        type="text"
        name="address"
        placeholder="Address"
        required
        className="input"
      />
      <input
        type="number"
        name="bedrooms"
        placeholder="Bedrooms"
        required
        className="input"
      />
      <input
        type="number"
        name="bathrooms"
        placeholder="Bathrooms"
        required
        className="input"
      />
      <input
        type="number"
        name="total_area"
        placeholder="Total Area (m²)"
        required
        className="input"
      />
      <input
        type="number"
        name="living_area"
        placeholder="Living Area (m²)"
        required
        className="input"
      />
      <input
        type="number"
        name="construction_year"
        placeholder="Construction Year"
        required
        className="input"
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="garage" />
        Garage
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="terrace" />
        Terrace
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="active" />
        Active
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="rentable" />
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
      <button
        type="submit"
        className="bg-accent-400 text-white py-2 px-4 rounded hover:bg-white hover:text-black"
      >
        Create House
      </button>
    </form>
  );
};

export default Form;