
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gota Neon Exterior - Baseada no design robusto da imagem */}
      <path 
        d="M50 2C50 2 12 42 12 72C12 91 29 100 50 100C71 100 88 91 88 72C88 42 50 2 50 2Z" 
        fill="#cfec0f"
      />
      {/* Gota Preta Interior - Proporção exata para criar o contorno neon */}
      <path 
        d="M50 32C50 32 28 52 28 72C28 84 38 90 50 90C62 90 72 84 72 72C72 52 50 32 50 32Z" 
        fill="black"
      />
      {/* Triângulo Neon Central - Posicionado ligeiramente abaixo do centro conforme o screenshot */}
      <path 
        d="M50 52L60 76H40L50 52Z" 
        fill="#cfec0f"
      />
    </svg>
  );
};

export default Logo;
