const ModifyButton = ({ editRef }: { editRef: string }) => {
  return (
    <button
      onClick={() => (window.location.href = editRef)}
      className="bg-accent-400 hover:bg-white text-white hover:text-black hover:shadow-md py-4 px-8 text-2xl mt-4 lg:mt-8 rounded-md cursor-pointer"
    >
      Modificar
    </button>
  );
};

export default ModifyButton;
