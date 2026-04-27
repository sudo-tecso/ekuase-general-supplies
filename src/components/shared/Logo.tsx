import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = "md",
  variant = "default",
}) => {
  const sizes = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
    xl: "w-80 h-80",
  };

  const currentSize = sizes[size];

  return (
    <div className={cn(
      "relative flex items-center justify-center bg-transparent", 
      currentSize, 
      variant === "white" && "mix-blend-screen",
      className
    )}>
      <img 
        src="/logo.png" 
        alt="Ekuase General Supplies" 
        className={cn(
          "w-full h-full object-contain",
          variant === "white" && "invert hue-rotate-180 brightness-150 contrast-125"
        )}
      />
    </div>
  );
};
