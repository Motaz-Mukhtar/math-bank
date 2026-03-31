import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NumPadProps {
  onConfirm: (value: string) => void;
}

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const NumPad: React.FC<NumPadProps> = ({ onConfirm }) => {
  const [value, setValue] = useState('');

  const handleDigitPress = (digit: string) => {
    setValue((prev) => prev + digit);
  };

  const handleDelete = () => {
    setValue((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    onConfirm(value);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      {/* Display */}
      <div className="w-full h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white text-2xl font-bold">
        {value || '٠'}
      </div>

      {/* Digit Grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {ARABIC_DIGITS.slice(1).map((digit) => (
          <Button
            key={digit}
            onClick={() => handleDigitPress(digit)}
            variant="outline"
            className="h-14 text-2xl font-bold"
          >
            {digit}
          </Button>
        ))}
      </div>

      {/* Bottom Row: 0, Delete, Confirm */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <Button
          onClick={() => handleDigitPress(ARABIC_DIGITS[0])}
          variant="outline"
          className="h-14 text-2xl font-bold"
        >
          {ARABIC_DIGITS[0]}
        </Button>
        <Button
          onClick={handleDelete}
          variant="outline"
          className="h-14 text-lg font-semibold"
        >
          حذف
        </Button>
        <Button
          onClick={handleConfirm}
          variant="default"
          className="h-14 text-lg font-semibold"
        >
          تأكيد
        </Button>
      </div>
    </div>
  );
};
