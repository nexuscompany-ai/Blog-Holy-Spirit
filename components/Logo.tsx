
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 8px rgba(207, 236, 15, 0.3))' }}
    >
      {/* Gota Neon Exterior */}
      <path 
        d="M50 5C50 5 10 50 10 85C10 105 28 120 50 120C72 120 90 105 90 85C90 50 50 5 50 5Z" 
        fill="#cfec0f"
      />
      {/* Gota Preta Interior */}
      <path 
        d="M50 35C50 35 26 55 26 85C26 97 37 107 50 107C63 107 74 97 74 85C74 55 50 35 50 35Z" 
        fill="black"
      />
      {/* Triângulo Neon Central */}
      <path 
        d="M50 60L62 88H38L50 60Z" 
        fill="#cfec0f"
      />
    </svg>
  );
};

export default Logo;
