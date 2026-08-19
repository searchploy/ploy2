"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
}: OTPInputProps) {
  const [otp, setOtp] = useState(value.split("").slice(0, 6));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync external value changes
  useEffect(() => {
    if (value.length === 0) {
      setOtp(["", "", "", "", "", ""]);
    }
  }, [value]);

  const handleChange = (index: number, digit: string) => {
    // Only allow digits
    const newDigit = digit.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = newDigit;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange(otpString);

    // Auto-advance to next field
    if (newDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all 6 digits are entered
    if (otpString.length === 6 && onComplete) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace: clear current and focus previous
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChange(newOtp.join(""));

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Arrow left
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Arrow right
    else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (pastedData.length > 0) {
      const newOtp = pastedData.split("").concat(["", "", "", "", "", ""]).slice(0, 6);
      setOtp(newOtp);
      const otpString = newOtp.join("");
      onChange(otpString);

      // Focus last filled input or last input if all filled
      const focusIndex = Math.min(pastedData.length, 5);
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 0);

      // Call onComplete if all 6 digits
      if (otpString.length === 6 && onComplete) {
        onComplete(otpString);
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          className={cn(
            "h-12 w-12 rounded-lg border-2 text-center text-lg font-semibold transition-colors",
            "flex items-center justify-center",
            error
              ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/20"
              : "border-border bg-card hover:border-muted-foreground focus:border-ploy-gold focus:ring-ploy-gold/20",
            disabled && "opacity-50 cursor-not-allowed",
            "focus:outline-none focus:ring-2"
          )}
        />
      ))}
    </div>
  );
}
