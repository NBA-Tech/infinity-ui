'use client';
import React, { useContext } from 'react';
import { createInput } from '@gluestack-ui/input';
import { View, Pressable, TextInput } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const SCOPE = 'INPUT';

const UIInput = createInput({
  Root: withStyleContext(View, SCOPE),
  Icon: UIIcon,
  Slot: Pressable,
  Input: TextInput,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    },
  },
});

// ------------------------- TVA STYLES -------------------------
const inputStyle = tva({
  base: 'border flex-row items-center overflow-hidden flex-nowrap flex-shrink-0 content-center rounded-lg px-3 font-inter',
  variants: {
    isDark: {
      true: 'bg-[#1f2937] text-white placeholder:text-[#aaa] border-[#374151]',
      false: 'bg-white text-black placeholder:text-[#595959] border-[#d1d5db]',
    },
    size: {
      sm: 'h-[3vh]',
      md: 'h-[4vh]',
      lg: 'h-[5vh]',
      xl: 'h-[6vh]',
    },
    variant: {
      underlined:
        'rounded-none border-b data-[invalid=true]:border-error-700',
      outline: 'rounded border data-[invalid=true]:border-error-700',
      rounded: 'rounded-full border data-[invalid=true]:border-error-700',
    },
  },
});

const inputFieldStyle = tva({
  base: 'flex-1 py-0 px-3 h-full ios:leading-[0px] font-inter',
  variants: {
    isDark: {
      true: 'text-white placeholder:text-[#aaa] bg-[#1f2937]',
      false: 'text-black placeholder:text-[#808080] bg-white',
    },
  },
  parentVariants: {
    variant: {
      underlined: 'web:outline-0 px-0',
      outline: 'web:outline-0',
      rounded: 'web:outline-0 px-4',
    },
    size: {
      '2xs': 'text-2xs',
      'xs': 'text-xs',
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
  },
});

const inputSlotStyle = tva({
  base: 'justify-center items-center rounded-lg h-16',
  variants: {
    isDark: {
      true: 'bg-[#1f2937]',
      false: 'bg-white',
    },
  },
});

const inputIconStyle = tva({
  base: 'justify-center items-center fill-none',
  variants: {
    isDark: {
      true: 'text-white',
      false: 'text-black',
    },
  },
  parentVariants: {
    size: {
      '2xs': 'h-3 w-3',
      'xs': 'h-3.5 w-3.5',
      'sm': 'h-4 w-4',
      'md': 'h-[18px] w-[18px]',
      'lg': 'h-5 w-5',
      'xl': 'h-6 w-6',
    },
  },
});

// ------------------------- COMPONENTS -------------------------
type IInputProps = React.ComponentProps<typeof UIInput> &
  VariantProps<typeof inputStyle> & { className?: string };
const Input = React.forwardRef<React.ComponentRef<typeof UIInput>, IInputProps>(
  function Input({ className, variant = 'outline', size = 'md', ...props }, ref) {
    const themeContext = useContext(ThemeToggleContext) || {};
    const isDark = themeContext.isDark ?? false;

    return (
      <UIInput
        ref={ref}
        {...props}
        className={inputStyle({ variant, size, isDark, class: className })}
        context={{ variant, size, isDark }}
      />
    );
  }
);

type IInputIconProps = React.ComponentProps<typeof UIInput.Icon> &
  VariantProps<typeof inputIconStyle> & { className?: string; height?: number; width?: number; };

const InputIcon = React.forwardRef<
  React.ComponentRef<typeof UIInput.Icon>,
  IInputIconProps
>(function InputIcon({ className, size, ...props }, ref) {
  const { size: parentSize } = useStyleContext(SCOPE);
  const themeContext = useContext(ThemeToggleContext) || {};
  const isDark = themeContext.isDark ?? false;

  return (
    <UIInput.Icon
      ref={ref}
      {...props}
      className={inputIconStyle({ isDark, parentVariants: { size: parentSize }, class: className })}
      size={size as any}
    />
  );
});

type IInputSlotProps = React.ComponentProps<typeof UIInput.Slot> &
  VariantProps<typeof inputSlotStyle> & { className?: string };

const InputSlot = React.forwardRef<
  React.ComponentRef<typeof UIInput.Slot>,
  IInputSlotProps
>(function InputSlot({ className, ...props }, ref) {
  const themeContext = useContext(ThemeToggleContext) || {};
  const isDark = themeContext.isDark ?? false;

  return (
    <UIInput.Slot
      ref={ref}
      {...props}
      className={inputSlotStyle({ isDark, class: className })}
    />
  );
});

type IInputFieldProps = React.ComponentProps<typeof UIInput.Input> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = React.forwardRef<
  React.ComponentRef<typeof UIInput.Input>,
  IInputFieldProps
>(function InputField({ className, ...props }, ref) {
  const themeContext = useContext(ThemeToggleContext) || {};
  const isDark = themeContext.isDark ?? false;
  const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);
  const globalStyles = useContext(StyleContext);

  return (
    <UIInput.Input
      ref={ref}
      {...props}
      className={inputFieldStyle({
        isDark,
        parentVariants: { variant: parentVariant, size: parentSize },
        class: className,
      })}
      style={[globalStyles.labelText]}
    />
  );
});

Input.displayName = 'Input';
InputIcon.displayName = 'InputIcon';
InputSlot.displayName = 'InputSlot';
InputField.displayName = 'InputField';

export { Input, InputField, InputIcon, InputSlot };
