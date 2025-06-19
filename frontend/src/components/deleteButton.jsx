const Boton = ({id}) => {
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
      <button className="z-30 bg-red-300" onClick={handleDelete}>
        Click aquí
      </button>
    );
  };
  
  export default Boton;