'use client';
import React, { useState, useCallback, createContext, useContext } from 'react';
import {
  View,
  Pressable,
  Text,
  Platform,
  TextProps,
  LayoutAnimation,
} from 'react-native';

import { tva } from '@gluestack-ui/nativewind-utils/tva';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';

import { H3 } from '@expo/html-elements';
import { cssInterop } from 'nativewind';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/icon';

const SCOPE = 'ACCORDION';

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const accordionStyle = tva({
  base: 'w-full',
  variants: {
    variant: { filled: 'bg-white shadow-hard-2', unfilled: '' },
    size: { sm: '', md: '', lg: '' },
  },
});

const accordionItemStyle = tva({
  base: '',
  parentVariants: {
    variant: {
      filled: 'bg-background-0',
      unfilled: 'bg-transparent',
    },
  },
});

const accordionTitleTextStyle = tva({
  base: 'text-typography-900 font-bold flex-1 text-left',
  parentVariants: { size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' } },
});

const accordionIconStyle = tva({
  base: 'text-typography-900 fill-none',
  parentVariants: {
    size: {
      '2xs': 'h-3 w-3',
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-[18px] w-[18px]',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    },
  },
});

const accordionContentTextStyle = tva({
  base: 'text-typography-700 font-normal',
  parentVariants: { size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' } },
});

const accordionHeaderStyle = tva({ base: 'mx-0 my-0' });

const accordionContentStyle = tva({ base: '' });

const accordionTriggerStyle = tva({
  base: 'w-full flex-row justify-between items-center web:outline-none focus:outline-none py-3 px-4',
});

/* -------------------------------------------------------------------------- */
/*                               BASE ELEMENTS                                */
/* -------------------------------------------------------------------------- */
const Root = withStyleContext(View, SCOPE);
const Header = (Platform.OS === 'web' ? H3 : View) as React.ComponentType<TextProps>;

const UIAccordion = {
  Root,
  Item: View,
  Header,
  Trigger: Pressable,
  Icon: UIIcon,
  TitleText: Text,
  Content: View,
  ContentText: Text,
};

/* -------------------------------------------------------------------------- */
/*                                cssInterop                                   */
/* -------------------------------------------------------------------------- */
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

cssInterop(H3, { className: { target: 'style' } });

/* -------------------------------------------------------------------------- */
/*                                 TYPES                                      */
/* -------------------------------------------------------------------------- */

type IAccordionProps = React.ComponentPropsWithoutRef<typeof UIAccordion.Root> &
  VariantProps<typeof accordionStyle> & {
    type?: 'single' | 'multiple';
    isCollapsible?: boolean;
    value?: string | string[];
    defaultValue?: string | string[];
  };

type IAccordionItemProps = {
  value: string;
} & React.ComponentPropsWithoutRef<typeof UIAccordion.Item> &
  VariantProps<typeof accordionItemStyle>;

type IAccordionTriggerProps = React.ComponentPropsWithoutRef<typeof UIAccordion.Trigger> &
  VariantProps<typeof accordionTriggerStyle>;

type IAccordionContentProps = React.ComponentPropsWithoutRef<typeof UIAccordion.Content>;

type IAccordionContentTextProps = React.ComponentPropsWithoutRef<
  typeof UIAccordion.ContentText
> &
  VariantProps<typeof accordionContentTextStyle>;

type IAccordionIconProps = VariantProps<typeof accordionIconStyle> &
  React.ComponentPropsWithoutRef<typeof UIAccordion.Icon>;

/* -------------------------------------------------------------------------- */
/*                       Internal context for open state                      */
/* -------------------------------------------------------------------------- */

type InternalContext = {
  activeItems: string[];
  toggleItem: (value: string) => void;
};

const AccordionInternalContext = createContext<InternalContext | null>(null);

const useAccordionInternal = () => {
  const ctx = useContext(AccordionInternalContext);
  if (!ctx) throw new Error('Accordion child used outside of Accordion provider');
  return ctx;
};

/* -------------------------------------------------------------------------- */
/*                              ACCORDION ROOT                                */
/* -------------------------------------------------------------------------- */

const Accordion = React.forwardRef<View, IAccordionProps>(
  (
    {
      className,
      variant = 'filled',
      size = 'md',
      type = 'single',
      isCollapsible = false,
      children,
      defaultValue,
      value,
      ...props
    },
    ref
  ) => {
    // Controlled or uncontrolled initial state — use uncontrolled internal state for simplicity
    const [activeItems, setActiveItems] = useState<string[]>(
      value
        ? Array.isArray(value)
          ? value
          : [value]
        : defaultValue
        ? Array.isArray(defaultValue)
          ? defaultValue
          : [defaultValue]
        : []
    );

    const toggleItem = useCallback(
      (itemValue: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setActiveItems((prev) => {
          if (type === 'single') {
            if (prev.includes(itemValue)) {
              // already open
              return isCollapsible ? [] : prev;
            }
            return [itemValue];
          } else {
            // multiple
            return prev.includes(itemValue) ? prev.filter((v) => v !== itemValue) : [...prev, itemValue];
          }
        });
      },
      [type, isCollapsible]
    );

    return (
      <UIAccordion.Root
        ref={ref}
        {...props}
        className={accordionStyle({ variant, class: className })}
        // keep style context for tva usage
        context={{ variant, size }}
      >
        <AccordionInternalContext.Provider value={{ activeItems, toggleItem }}>
          {children}
        </AccordionInternalContext.Provider>
      </UIAccordion.Root>
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                       helper: recursively map children                     */
/* -------------------------------------------------------------------------- */

function mapChildrenInject(children: any, injector: (child: any) => any) {
  if (!children) return children;

  if (Array.isArray(children)) {
    return children.map((c, i) => mapChildrenInject(c, injector));
  }

  if (React.isValidElement(children)) {
    const mappedPropsChildren =
      children.props && children.props.children
        ? mapChildrenInject(children.props.children, injector)
        : children.props.children;

    // create a clone with mapped children first, then give injector a chance to change element
    const cloned = React.cloneElement(children, { ...children.props, children: mappedPropsChildren });

    // injector can return the same element or a modified clone
    return injector(cloned);
  }

  // primitive (string/number)
  return children;
}

/* -------------------------------------------------------------------------- */
/*                              ACCORDION ITEM                                */
/* -------------------------------------------------------------------------- */

const AccordionItem = React.forwardRef<View, IAccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const styleCtx = useStyleContext(SCOPE);
    const { activeItems, toggleItem } = useAccordionInternal();
    const open = activeItems.includes(value);

    // injector will add open/onToggle props to any AccordionTrigger elements,
    // and will conditionally render AccordionContent only when open.
    const injector = (child: any) => {
      if (!React.isValidElement(child)) return child;

      const disp = (child.type && (child.type.displayName || child.type.name)) ?? null;

      if (disp === 'AccordionTrigger') {
        // inject open & onToggle
        return React.cloneElement(child, { ...child.props, open, onToggle: () => toggleItem(value) });
      }

      if (disp === 'AccordionContent') {
        // only render content when open
        return open ? child : null;
      }

      // otherwise return as-is
      return child;
    };

    const mapped = mapChildrenInject(children, injector);

    return (
      <UIAccordion.Item
        ref={ref}
        {...props}
        className={accordionItemStyle({
          parentVariants: { variant: styleCtx?.variant ?? 'filled' },
          class: className,
        })}
      >
        {mapped}
      </UIAccordion.Item>
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                           ACCORDION TRIGGER                                */
/* -------------------------------------------------------------------------- */

const AccordionTrigger = React.forwardRef<View, any>(
  ({ className, children, open, onToggle, ...props }, ref) => {
    const isRenderProp = typeof children === 'function';

    return (
      <UIAccordion.Trigger
        ref={ref}
        {...props}
        onPress={onToggle}
        className={accordionTriggerStyle({ class: className })}
      >
        {isRenderProp ? children({ isExpanded: !!open }) : children}
      </UIAccordion.Trigger>
    );
  }
);

/* -------------------------------------------------------------------------- */
const AccordionHeader = React.forwardRef<View, any>(
  ({ className, ...props }, ref) => {
    return (
      <UIAccordion.Header
        ref={ref}
        {...props}
        className={accordionHeaderStyle({ class: className })}
      />
    );
  }
);

const AccordionTitleText = React.forwardRef<Text, any>(
  ({ className, ...props }, ref) => {
    const { size } = useStyleContext(SCOPE);

    return (
      <UIAccordion.TitleText
        ref={ref}
        {...props}
        className={accordionTitleTextStyle({
          parentVariants: { size },
          class: className,
        })}
      />
    );
  }
);

const AccordionIcon = React.forwardRef<any, IAccordionIconProps>(
  ({ size, className, ...props }, ref) => {
    const { size: parentSize } = useStyleContext(SCOPE);

    return (
      <UIAccordion.Icon
        ref={ref}
        {...props}
        className={accordionIconStyle({
          size,
          class: className,
          parentVariants: { size: parentSize },
        })}
      />
    );
  }
);

const AccordionContent = React.forwardRef<View, IAccordionContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <UIAccordion.Content
        ref={ref}
        {...props}
        className={accordionContentStyle({ class: className })}
      />
    );
  }
);

const AccordionContentText = React.forwardRef<Text, IAccordionContentTextProps>(
  ({ className, ...props }, ref) => {
    const { size } = useStyleContext(SCOPE);

    return (
      <UIAccordion.ContentText
        ref={ref}
        {...props}
        className={accordionContentTextStyle({
          parentVariants: { size },
          class: className,
        })}
      />
    );
  }
);

/* -------------------------------------------------------------------------- */
/*                           DISPLAY NAMES                                    */
/* -------------------------------------------------------------------------- */

Accordion.displayName = 'Accordion';
AccordionItem.displayName = 'AccordionItem';
AccordionHeader.displayName = 'AccordionHeader';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionTitleText.displayName = 'AccordionTitleText';
AccordionContentText.displayName = 'AccordionContentText';
AccordionIcon.displayName = 'AccordionIcon';
AccordionContent.displayName = 'AccordionContent';

/* -------------------------------------------------------------------------- */
export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
};
