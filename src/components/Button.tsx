interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
  }
  
  const Button = ({ children, onClick, className, type }: Props) => (
    <button
      className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
  
  export default Button;
  