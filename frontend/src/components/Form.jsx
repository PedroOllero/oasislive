const Form = () => {

  const submit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const houseData = {
      title: formData.get("title"),
      price: Number(formData.get("price")),
      description: formData.get("description"),
      address: formData.get("address"),
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
    }).catch(()=>{
      console.log("Error during posting house")
      alert("Error during posting house")
    })

    const house = await res.json();
    const houseId = house.id;

    // Paso 2: Subir imágenes a Cloudinary
    const imageFiles = formData.getAll("images");
    const uploadedImages = [];

    for (const file of imageFiles) {
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
          alt: uploaded.alt || file.name,
          order_index: uploadedImages.length,
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

    alert("House created with images!", houseData, "con imagenes", imageFiles);
    console.log(houseData);
    console.log(imageFiles);
    // window.location.href = "/";
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
      <input type="file" name="images" multiple className="input bg-red-400" />
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