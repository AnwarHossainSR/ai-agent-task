// Button Component
import PropTypes from "prop-types";

export function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded text-white font-bold shadow-md transition-all duration-300 ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

// Card and CardContent Components
export function Card({ children }) {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">{children}</div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};
