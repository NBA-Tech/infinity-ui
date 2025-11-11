'use client';
import React, { useContext } from 'react';
import { createMenu } from '@gluestack-ui/menu';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import {
  Motion,
  AnimatePresence,
  MotionComponentProps,
} from '@legendapp/motion';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { ThemeToggleContext } from '@/src/providers/theme/global-style-provider';

type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

// ------------------------- TVA STYLES -------------------------
const menuStyle = tva({
  base: 'rounded-md border p-1 shadow-hard-5',
  variants: {
    isDark: {
      true: 'bg-[#0E1628] border-[#1E293B]',
      false: 'bg-[#F5F7FB] border-[#CBD5E1]',
    },
  },
});

const menuItemStyle = tva({
  base: 'min-w-[200px] p-3 flex-row items-center rounded transition-all',
  variants: {
    isDark: {
      true: 'text-[#F5F7FA] data-[hover=true]:bg-[#1E293B] data-[active=true]:bg-[#2D3748]',
      false: 'text-[#182D53] data-[hover=true]:bg-[#E2E8F0] data-[active=true]:bg-[#CBD5E1]',
    },
  },
});

const menuBackdropStyle = tva({
  base: 'absolute top-0 bottom-0 left-0 right-0 web:cursor-default',
  variants: {
    isDark: {
      true: 'bg-black/50',
      false: 'bg-black/20',
    },
  },
});

const menuSeparatorStyle = tva({
  base: 'h-px w-full',
  variants: {
    isDark: {
      true: 'bg-[#334155]',
      false: 'bg-[#E2E8F0]',
    },
  },
});

const menuItemLabelStyle = tva({
  base: 'font-body font-normal',
  variants: {
    isDark: {
      true: 'text-[#F5F7FA]',
      false: 'text-[#182D53]',
    },
    isTruncated: {
      true: 'web:truncate',
    },
    bold: { true: 'font-bold' },
    underline: { true: 'underline' },
    strikeThrough: { true: 'line-through' },
    size: {
      'sm': 'text-sm',
      'md': 'text-base',
      'lg': 'text-lg',
    },
  },
});

// ------------------------- COMPONENTS -------------------------

const BackdropPressable = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> &
    VariantProps<typeof menuBackdropStyle>
>(function BackdropPressable({ className, ...props }, ref) {
  const { isDark } = useContext(ThemeToggleContext);
  return (
    <Pressable
      ref={ref}
      className={menuBackdropStyle({
        isDark,
        class: className,
      })}
      {...props}
    />
  );
});

type IMenuItemProps = VariantProps<typeof menuItemStyle> & {
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Item = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  IMenuItemProps
>(function Item({ className, ...props }, ref) {
  const { isDark } = useContext(ThemeToggleContext);
  return (
    <Pressable
      ref={ref}
      className={menuItemStyle({
        isDark,
        class: className,
      })}
      {...props}
    />
  );
});

const Separator = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> &
    VariantProps<typeof menuSeparatorStyle>
>(function Separator({ className, ...props }, ref) {
  const { isDark } = useContext(ThemeToggleContext);
  return (
    <View
      ref={ref}
      className={menuSeparatorStyle({
        isDark,
        class: className,
      })}
      {...props}
    />
  );
});

// ------------------------- MENU CREATION -------------------------
export const UIMenu = createMenu({
  Root: MotionView,
  Item: Item,
  Label: Text,
  Backdrop: BackdropPressable,
  AnimatePresence: AnimatePresence,
  Separator: Separator,
});

cssInterop(MotionView, { className: 'style' });

// ------------------------- MAIN MENU WRAPPER -------------------------
type IMenuProps = React.ComponentProps<typeof UIMenu> &
  VariantProps<typeof menuStyle> & { className?: string };
type IMenuItemLabelProps = React.ComponentProps<typeof UIMenu.ItemLabel> &
  VariantProps<typeof menuItemLabelStyle> & { className?: string };

const Menu = React.forwardRef<React.ComponentRef<typeof UIMenu>, IMenuProps>(
  function Menu({ className, ...props }, ref) {
    const { isDark } = useContext(ThemeToggleContext);

    return (
      <UIMenu
        ref={ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'timing', duration: 100 }}
        className={menuStyle({ isDark, class: className })}
        {...props}
      />
    );
  }
);

const MenuItem = UIMenu.Item;

const MenuItemLabel = React.forwardRef<
  React.ComponentRef<typeof UIMenu.ItemLabel>,
  IMenuItemLabelProps
>(function MenuItemLabel(
  { className, isTruncated, bold, underline, strikeThrough, size = 'md', ...props },
  ref
) {
  const { isDark } = useContext(ThemeToggleContext);
  return (
    <UIMenu.ItemLabel
      ref={ref}
      className={menuItemLabelStyle({
        isDark,
        isTruncated,
        bold,
        underline,
        strikeThrough,
        size,
        class: className,
      })}
      {...props}
    />
  );
});

const MenuSeparator = UIMenu.Separator;

// ------------------------- DISPLAY NAMES -------------------------
Menu.displayName = 'Menu';
MenuItem.displayName = 'MenuItem';
MenuItemLabel.displayName = 'MenuItemLabel';
MenuSeparator.displayName = 'MenuSeparator';

export { Menu, MenuItem, MenuItemLabel, MenuSeparator };
