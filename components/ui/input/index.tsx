'use client';
import React, { useContext, useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import clsx from "clsx";

const SCOPE = 'INPUT';

cssInterop(TextInput, { className: { target: 'style' } });

/* -----------------------------------------------------------
                      Manual Input Component
------------------------------------------------------------ */

const Root = withStyleContext(View, SCOPE);

const UIInput = {
  Root,
  Slot: Pressable,
  Input: TextInput,
  Icon: View,
};

/* -----------------------------------------------------------
                        TAILWIND STYLES
------------------------------------------------------------ */

const inputStyle = tva({
  base: 'border flex-row items-center overflow-hidden flex-nowrap flex-shrink-0 content-center rounded-lg px-3',
  variants: {
    isDark: {
      true: 'bg-[#0E1628] text-[#F5F7FA] placeholder:text-[#94A3B8] border-[#1E293B]',
      false: 'bg-[#F5F7FB] text-[#182D53] placeholder:text-[#6B7280] border-[#CBD5E1]',
    },
    size: {
      sm: 'h-[3vh]',
      md: 'h-[4vh]',
      lg: 'h-[6vh]',
      xl: 'h-[7vh]',
    },
    variant: {
      underlined: 'rounded-none border-b',
      outline: 'rounded border',
      rounded: 'rounded-full border',
    },
  },
});

const inputFieldStyle = tva({
  base: 'flex-1 py-0 px-3 h-full ios:leading-[0px]',
  variants: {
    isDark: {
      true: 'text-[#F5F7FA] placeholder:text-[#94A3B8]',
      false: 'text-[#182D53] placeholder:text-[#6B7280]',
    },
  },
  parentVariants: {
    variant: {
      underlined: 'px-1',
      outline: 'px-1',
      rounded: 'px-3 rounded-full',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
});

const inputSlotStyle = tva({
  base: 'justify-center items-center rounded-lg',
  variants: {
    isDark: {
      true: 'bg-[#0E1628]',
      false: 'bg-[#F5F7FB]',
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
});

/* -----------------------------------------------------------
                          INPUT ROOT
------------------------------------------------------------ */

type IInputProps = React.ComponentProps<typeof UIInput.Root> &
  VariantProps<typeof inputStyle> & { className?: string };

const Input = React.forwardRef<any, IInputProps>(
  function Input({ className, variant = 'outline', size = 'md', ...props }, ref) {
    const { isDark = false } = useContext(ThemeToggleContext) || {};

    // ⭐ pull error state from FormControl
    const formCtx = useStyleContext("FORM_CONTROL") ?? {};
    const { isInvalid } = formCtx;

    return (
      <UIInput.Root
        ref={ref}
        {...props}
        className={clsx(
          inputStyle({ variant, size, isDark }),
          className,
          isInvalid && "border-error-700"
        )}
        context={{ variant, size, isDark }}
      />
    );
  }
);

/* -----------------------------------------------------------
                         INPUT FIELD
------------------------------------------------------------ */

const InputField = React.forwardRef<any, any>(function InputField(
  { className, onFocus, onBlur, ...props },
  ref
) {
  const { isDark = false } = useContext(ThemeToggleContext) || {};
  const { variant: parentVariant, size: parentSize } = useStyleContext(SCOPE);

  // We get invalid state from FormControl
  const { isInvalid } = useStyleContext("FORM_CONTROL") ?? {};

  // ⭐ Track focus state
  const [isFocused, setFocused] = useState(false);
  const globalStyles=useContext(StyleContext)

  return (
    <UIInput.Input
      ref={ref}
      {...props}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      className={clsx(
        inputFieldStyle({
          isDark,
          parentVariants: { variant: parentVariant, size: parentSize },
        }),

        className,

        // ⭐ Focus border
        isFocused && "border-blue-600",

        // ⭐ Invalid border
        isInvalid && "border-error-700",

        // ⭐ Remove default shadow on focus in iOS
        "outline-none"
      )}
      style={[
        // Native fallback for border color
        globalStyles.normalText,
        isFocused
          ? { borderColor: "#2563EB" } // blue-600
          : isInvalid
          ? { borderColor: "#B91C1C" } // red-700
          : {},
      ]}
    />
  );
});

/* -----------------------------------------------------------
                          ICON
------------------------------------------------------------ */

const InputIcon = React.forwardRef<any, any>(function InputIcon(
  { className, size, ...props },
  ref
) {
  const { isDark = false } = useContext(ThemeToggleContext) || {};
  return (
    <UIInput.Icon
      ref={ref}
      {...props}
      className={inputIconStyle({ isDark, class: className })}
      size={size}
    />
  );
});

/* -----------------------------------------------------------
                           SLOT
------------------------------------------------------------ */

const InputSlot = React.forwardRef<any, any>(function InputSlot(
  { className, ...props },
  ref
) {
  const { isDark = false } = useContext(ThemeToggleContext) || {};

  return (
    <UIInput.Slot
      ref={ref}
      {...props}
      className={inputSlotStyle({ isDark, class: className })}
    />
  );
});

/* -----------------------------------------------------------
                          EXPORTS
------------------------------------------------------------ */

Input.displayName = "Input";
InputField.displayName = "InputField";
InputSlot.displayName = "InputSlot";
InputIcon.displayName = "InputIcon";

export { Input, InputField, InputIcon, InputSlot };
