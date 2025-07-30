const ModifyButton = ({ editRef }: { editRef: string }) => {
  return (
    <button
      onClick={() => (window.location.href = editRef)}
      className="bg-accent-400 text-white py-4 px-8 text-2xl mt-4 lg:mt-8"
    >
      Modificar
    </button>
  );
};

export default ModifyButton;
