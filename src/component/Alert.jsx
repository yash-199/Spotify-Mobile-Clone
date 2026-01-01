const Alert = ({ message }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 
                    bg-white text-black px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );
};

export default Alert;
