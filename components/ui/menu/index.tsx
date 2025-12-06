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

// ---------------- THEME AWARE HOOK ----------------
const useMenuTheme = () => {
  const { isDark } = useContext(ThemeToggleContext);

  return {
    menuBg: isDark ? 'bg-[#1E293B]' : 'bg-background-0',
    menuBorder: isDark ? 'border-[#334155]' : 'border-outline-100',
    menuShadow: isDark ? 'shadow-black/40' : 'shadow-hard-5',

    menuItemHover: isDark ? 'data-[hover=true]:bg-[#334155]' : 'data-[hover=true]:bg-background-50',
    menuItemActive: isDark ? 'data-[active=true]:bg-[#475569]' : 'data-[active=true]:bg-background-100',

    textColor: isDark ? 'text-white' : 'text-typography-700',

    separatorColor: isDark ? 'bg-[#475569]' : 'bg-background-200',
  };
};

// ---------- MOTION VIEW ----------
type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;
const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

// ---------- BASE STYLES WITH TVA (theme overrides inside component) ----------
const menuStyle = tva({
  base: 'rounded-md',
});

const menuItemStyle = tva({
  base: 'min-w-[200px] p-3 flex-row items-center rounded',
});

const menuBackdropStyle = tva({
  base: 'absolute top-0 bottom-0 left-0 right-0',
});

const menuSeparatorStyle = tva({
  base: 'h-px w-full',
});

// ---------- COMPONENTS ----------
const BackdropPressable = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & VariantProps<typeof menuBackdropStyle>
>(function BackdropPressable({ className, ...props }, ref) {
  return (
    <Pressable
      ref={ref}
      className={menuBackdropStyle({ class: className })}
      {...props}
    />
  );
});

type IMenuItemProps = VariantProps<typeof menuItemStyle> & {
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Item = React.forwardRef<React.ComponentRef<typeof Pressable>, IMenuItemProps>(
  function Item({ className, ...props }, ref) {
    const theme = useMenuTheme();
    return (
      <Pressable
        ref={ref}
        className={menuItemStyle({
          class: `${theme.menuItemHover} ${theme.menuItemActive} ${className}`,
        })}
        {...props}
      />
    );
  }
);

const Separator = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & VariantProps<typeof menuSeparatorStyle>
>(function Separator({ className, ...props }, ref) {
  const theme = useMenuTheme();
  return (
    <View
      ref={ref}
      className={menuSeparatorStyle({ class: `${theme.separatorColor} ${className}` })}
      {...props}
    />
  );
});

// ---------- CREATE MENU ----------
export const UIMenu = createMenu({
  Root: MotionView,
  Item: Item,
  Label: Text,
  Backdrop: BackdropPressable,
  AnimatePresence: AnimatePresence,
  Separator: Separator,
});

cssInterop(MotionView, { className: 'style' });

// ---------- MENU WRAPPERS ----------
type IMenuProps = React.ComponentProps<typeof UIMenu> & {
  className?: string;
};
type IMenuItemLabelProps = React.ComponentProps<typeof UIMenu.ItemLabel> & {
  className?: string;
};

const Menu = React.forwardRef<React.ComponentRef<typeof UIMenu>, IMenuProps>(
  function Menu({ className, ...props }, ref) {
    const theme = useMenuTheme();

    return (
      <UIMenu
        ref={ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'timing', duration: 100 }}
        className={menuStyle({
          class: `${theme.menuBg} ${theme.menuBorder} ${theme.menuShadow} ${className}`,
        })}
        {...props}
      />
    );
  }
);

const MenuItem = UIMenu.Item;

const MenuItemLabel = React.forwardRef<
  React.ComponentRef<typeof UIMenu.ItemLabel>,
  IMenuItemLabelProps
>(function MenuItemLabel({ className, ...props }, ref) {
  const theme = useMenuTheme();

  return (
    <UIMenu.ItemLabel
      ref={ref}
      className={`${theme.textColor} ${className}`}
      {...props}
    />
  );
});

const MenuSeparator = UIMenu.Separator;

// ---------- EXPORT ----------
Menu.displayName = 'Menu';
MenuItem.displayName = 'MenuItem';
MenuItemLabel.displayName = 'MenuItemLabel';
MenuSeparator.displayName = 'MenuSeparator';

export { Menu, MenuItem, MenuItemLabel, MenuSeparator };
