const Form = () => {
  const submit = async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const form = event.target;
    const formData = new FormData(form);

    // Paso 1: Crear la casa
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
    });

    const house = await res.json();
    const houseId = house.id;

    // Paso 2: Subir imágenes a Cloudinary
    const imageFiles = formData.getAll("images");

    for (const file of imageFiles) {
      const cloudinaryForm = new FormData();
      cloudinaryForm.append("image", file);
      cloudinaryForm.append("houseId", String(houseId));

      await fetch(`http://localhost:${PORT}/images/${houseId}`, {
        method: "POST",
        body: cloudinaryForm,
      });

      console.log(file.name, file.size, file.type);
    }

    alert("House created with images!");
    console.log(houseData);
    console.log(imageFiles);
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg grid gap-4"
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="title"
        placeholder="Title"
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
      <input type="file" name="images" multiple className="input" />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create House
      </button>
    </form>
  );
};

export default Form;