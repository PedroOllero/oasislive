const Boton = ({id}: {id: number}) => {
    const PORT = import.meta.env.PUBLIC_API_PORT || 3001;

    const handleDelete = async () => {
        await fetch(`http://localhost:${PORT}/houses/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    };
    return (
      <button className="z-30 text-red-500 mt-8" onClick={handleDelete}>
        Borrar esta casa
      </button>
    );
  };
  
  export default Boton;