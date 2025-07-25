const BackHeroButton = () => {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="px-4 py-4 text-white text-6xl mt-4 bg-primary-400"
    >
    Volver al inicio
    </button>
  );
};

export default BackHeroButton;