'use client';
import React from 'react';
import { View, Text } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { cssInterop } from 'nativewind';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import { UIIcon } from '@gluestack-ui/icon';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';

const SCOPE = 'FORM_CONTROL';

/* -------------------------------------------------
   cssInterop — IMPORTANT FOR TAILWIND TO WORK
-------------------------------------------------- */
cssInterop(View, { className: { target: 'style' } });
cssInterop(Text, { className: { target: 'style' } });
cssInterop(UIIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: true,
      stroke: true,
    },
  },
});

/* -------------------------------------------------
   FORM CONTROL ROOT STYLE
-------------------------------------------------- */
const formControlStyle = tva({
  base: 'flex flex-col',
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
});

/* -------------------------------------------------
   LABEL STYLES
-------------------------------------------------- */
const labelStyle = tva({
  base: 'flex flex-row justify-start items-center mb-1',
});

const labelTextStyle = tva({
  base: 'font-medium text-typography-900',
  parentVariants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
});

const labelAstrickStyle = tva({
  base: 'font-medium text-error-600 ml-1',
});

/* -------------------------------------------------
   ERROR STYLES
-------------------------------------------------- */
const errorStyle = tva({
  base: 'flex flex-row items-center mt-1 gap-1',
});

const errorTextStyle = tva({
  base: 'text-error-700',
  parentVariants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
});

const errorIconStyle = tva({
  base: 'text-error-700 fill-none',
  parentVariants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    },
  },
});

/* -------------------------------------------------
   HELPER STYLES
-------------------------------------------------- */
const helperStyle = tva({
  base: 'flex flex-row items-center mt-1',
});

const helperTextStyle = tva({
  base: 'text-typography-500',
  parentVariants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
});

/* -------------------------------------------------
   COMPONENTS (GLUESTACK COMPATIBLE API)
-------------------------------------------------- */

const Root = withStyleContext(View, SCOPE);

export const FormControl = React.forwardRef<any, any>(
  function FormControl({ className, size = 'md', ...props }, ref) {
    return (
      <Root
        ref={ref}
        {...props}
        className={formControlStyle({ size, class: className })}
        context={{ size }}
      />
    );
  }
);

/* ---------------- LABEL ---------------- */
export const FormControlLabel = React.forwardRef<any, any>(
  function FormControlLabel({ className, ...props }, ref) {
    return (
      <View ref={ref} {...props} className={labelStyle({ class: className })} />
    );
  }
);

export const FormControlLabelText = React.forwardRef<any, any>(
  function FormControlLabelText({ className, ...props }, ref) {
    const ctx = useStyleContext(SCOPE);
    return (
      <Text
        ref={ref}
        {...props}
        className={labelTextStyle({
          parentVariants: ctx,
          class: className,
        })}
      />
    );
  }
);

export const FormControlLabelAstrick = React.forwardRef<any, any>(
  function FormControlLabelAstrick({ className, ...props }, ref) {
    return (
      <Text
        ref={ref}
        {...props}
        className={labelAstrickStyle({ class: className })}
      />
    );
  }
);

/* ---------------- ERROR ---------------- */
export const FormControlError = React.forwardRef<any, any>(
  function FormControlError({ className, ...props }, ref) {
    return (
      <View
        ref={ref}
        {...props}
        className={errorStyle({ class: className })}
      />
    );
  }
);

export const FormControlErrorText = React.forwardRef<any, any>(
  function FormControlErrorText({ className, ...props }, ref) {
    const ctx = useStyleContext(SCOPE);
    return (
      <Text
        ref={ref}
        {...props}
        className={errorTextStyle({
          parentVariants: ctx,
          class: className,
        })}
      />
    );
  }
);

export const FormControlErrorIcon = React.forwardRef<any, any>(
  function FormControlErrorIcon({ className, size, ...props }, ref) {
    const ctx = useStyleContext(SCOPE);
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={errorIconStyle({
          parentVariants: ctx,
          size,
          class: className,
        })}
      />
    );
  }
);

/* ---------------- HELPER ---------------- */
export const FormControlHelper = React.forwardRef<any, any>(
  function FormControlHelper({ className, ...props }, ref) {
    return (
      <View
        ref={ref}
        {...props}
        className={helperStyle({ class: className })}
      />
    );
  }
);

export const FormControlHelperText = React.forwardRef<any, any>(
  function FormControlHelperText({ className, ...props }, ref) {
    const ctx = useStyleContext(SCOPE);
    return (
      <Text
        ref={ref}
        {...props}
        className={helperTextStyle({
          parentVariants: ctx,
          class: className,
        })}
      />
    );
  }
);
