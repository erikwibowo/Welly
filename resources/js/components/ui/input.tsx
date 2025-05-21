import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./button";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={isPassword && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent dark:bg-input/30 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          isPassword ? "pr-10" : "",
          className
        )}
        {...props}
      />
      {isPassword && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary hover:bg-transparent"
        >
          {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
        </Button>
      )}
    </div>
  );
}

export { Input };
