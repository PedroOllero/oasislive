const BackHeroButton = () => {
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="text-white underline mt-4"
    >
      ← Back to Home
    </button>
  );
};

export default BackHeroButton;