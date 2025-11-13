// styles.ts
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { isWeb } from '@gluestack-ui/nativewind-utils/IsWeb';

const baseStyle = isWeb ? 'flex flex-col relative z-0' : '';

export const createCardStyle = (isDark: boolean) =>
  tva({
    base: baseStyle,
    variants: {
      size: {
        sm: 'p-3 rounded',
        md: 'p-4 rounded-md',
        lg: 'p-6 rounded-xl',
      },
      variant: {
        elevated: isDark ? 'bg-[#1A2238]' : 'bg-[#fff]',   // soft dark gray
        outline: isDark
          ? 'border border-[#3A3B47] bg-transparent'         // subtle dark border
          : 'border border-[#e0e0e0]',
        ghost: 'rounded-none',
        filled: isDark ? 'bg-[#1A2238]' : 'bg-[#fff]',   // slightly lighter dark for filled
      },
    },
  });
