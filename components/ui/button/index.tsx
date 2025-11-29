'use client';
import React from 'react';
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import { cssInterop } from 'nativewind';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';

const SCOPE = 'BUTTON';

/* --------------------------------------------
   REGISTER NATIVE COMPONENTS FOR TAILWIND
--------------------------------------------- */

cssInterop(Pressable, { className: { target: 'style' } });
cssInterop(Text, { className: { target: 'style' } });
cssInterop(View, { className: { target: 'style' } });
cssInterop(ActivityIndicator, { className: { target: 'style' } });
cssInterop(UIIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      stroke: true,
      color: 'classNameColor',
    },
  },
});

/* --------------------------------------------
   ROOT COMPONENT (IMPORTANT FIX!!)
--------------------------------------------- */

const Root = Pressable; // ← DO NOT WRAP WITH STYLE CONTEXT

/* --------------------------------------------
   UIButton Object (manual replacement)
--------------------------------------------- */

const UIButton = {
  Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
};

/* --------------------------------------------
   STYLE DEFINITIONS (SAME AS YOUR VERSION)
--------------------------------------------- */

const buttonStyle = tva({
  base: 'rounded-3xl flex-row items-center justify-center bg-primary-500 data-[disabled=true]:opacity-40 gap-2',
  variants: {
    action: {
      primary:
        'bg-primary-500 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700',
      secondary:
        'bg-secondary-500 data-[hover=true]:bg-secondary-600 data-[active=true]:bg-secondary-700',
      positive:
        'bg-success-500 data-[hover=true]:bg-success-600 data-[active=true]:bg-success-700',
      negative:
        'bg-error-500 data-[hover=true]:bg-error-600 data-[active=true]:bg-error-700',
      default: 'bg-transparent',
    },
    variant: {
      link: 'px-0 bg-transparent',
      outline:
        'bg-transparent border data-[hover=true]:bg-background-50',
      solid: '',
    },
    size: {
      xs: 'px-3.5 h-[2vh]',
      sm: 'px-4 h-[4vh]',
      md: 'px-5 h-[5vh]',
      lg: 'px-6 h-[6vh]',
      xl: 'px-7 h-[6vh]',
    },
  },
});

/* --------------------------------------------
   TEXT STYLE
--------------------------------------------- */

const buttonTextStyle = tva({
  base: 'font-semibold',
  parentVariants: {
    action: {
      primary: 'text-primary-600',
      secondary: 'text-typography-500',
      positive: 'text-success-600',
      negative: 'text-error-600',
    },
    variant: {
      link: 'underline',
      solid: 'text-typography-0',
      outline: '',
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

/* --------------------------------------------
   ICON STYLE
--------------------------------------------- */

const buttonIconStyle = tva({
  base: 'fill-none',
  parentVariants: {
    variant: {
      solid: 'text-typography-0',
    },
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-[18px] w-[18px]',
      lg: 'h-[18px] w-[18px]',
      xl: 'h-5 w-5',
    },
    action: {
      primary: 'text-primary-600',
      secondary: 'text-typography-500',
      positive: 'text-success-600',
      negative: 'text-error-600',
    },
  },
});

/* --------------------------------------------
   BUTTON GROUP STYLE
--------------------------------------------- */

const buttonGroupStyle = tva({
  base: '',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
    },
    isAttached: {
      true: 'gap-0',
    },
    flexDirection: {
      row: 'flex-row',
      column: 'flex-col',
    },
  },
});

/* --------------------------------------------
   MAIN BUTTON COMPONENT (FIXED)
--------------------------------------------- */

type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton.Root>,
  'context'
> &
  VariantProps<typeof buttonStyle> & {
    className?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
  };

const Button = React.forwardRef<any, IButtonProps>(function Button(
  {
    className,
    variant = 'solid',
    size = 'md',
    action = 'primary',
    isDisabled,
    isLoading,
    children,
    style,
    ...props
  },
  ref
) {
  return (
    <UIButton.Root
      ref={ref}
      disabled={isDisabled}
      className={buttonStyle({ variant, size, action, class: className })}
      style={[style, { opacity: isDisabled ? 0.4 : 1 }]} // ← FIXED, ALWAYS APPLIES NOW
      {...props}
    >
      {isLoading ? <ButtonSpinner /> : children}
    </UIButton.Root>
  );
});

/* --------------------------------------------
   BUTTON TEXT
--------------------------------------------- */

const ButtonText = React.forwardRef<any, any>(function ButtonText(
  { className, ...props },
  ref
) {
  const parent = useStyleContext(SCOPE);
  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: parent,
        class: className,
      })}
    />
  );
});

/* --------------------------------------------
   BUTTON SPINNER
--------------------------------------------- */

const ButtonSpinner = React.forwardRef<any>((props, ref) => {
  return <UIButton.Spinner ref={ref} {...props} />;
});

/* --------------------------------------------
   BUTTON ICON
--------------------------------------------- */

const ButtonIcon = React.forwardRef<any, any>(function ButtonIcon(
  { className, size, ...props },
  ref
) {
  const parent = useStyleContext(SCOPE);

  return (
    <UIButton.Icon
      ref={ref}
      {...props}
      className={buttonIconStyle({
        parentVariants: parent,
        size,
        class: className,
      })}
    />
  );
});

/* --------------------------------------------
   BUTTON GROUP
--------------------------------------------- */

type IButtonGroupProps = React.ComponentPropsWithoutRef<
  typeof UIButton.Group
> &
  VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<any, IButtonGroupProps>(
  function ButtonGroup(
    { className, space = 'md', isAttached = false, flexDirection = 'column', ...props },
    ref
  ) {
    return (
      <UIButton.Group
        ref={ref}
        {...props}
        className={buttonGroupStyle({ class: className, space, isAttached, flexDirection })}
      />
    );
  }
);

/* --------------------------------------------
   EXPORT
--------------------------------------------- */

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
