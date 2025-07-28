const ModifyButton = ({ editRef }: { editRef: string }) => {
  return (
    <button
      onClick={() => (window.location.href = editRef)}
      className="bg-accent-400 py-4 px-8 text-2xl mt-8"
    >
      Modificar
    </button>
  );
};

export default ModifyButton;
