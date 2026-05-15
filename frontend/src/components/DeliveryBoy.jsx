const DeliveryBoy = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-500 to-white text-black px-4">
      <div className="text-center max-w-md">
        
        {/* Icon / Emoji */}
        <div className="text-6xl mb-4">🚧</div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-black mb-6">
          We're working hard to bring the Delivery Boy feature to you.
          Stay tuned!
        </p>

        {/* Loader */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Button (optional) */}
        <button
          onClick={() => window.history.back()}
          className="bg-white text-black font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-orange-100 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default DeliveryBoy;
