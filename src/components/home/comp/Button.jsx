import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
        outline:
          "border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        secondary:
          "bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 py-3 text-base",
        lg: "h-12 px-8 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";