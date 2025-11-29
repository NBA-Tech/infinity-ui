'use client';
import React, { useState, useContext, useRef } from 'react';
import { Pressable, View, Text } from 'react-native';
import { Motion, AnimatePresence } from '@legendapp/motion';
import { ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { Portal } from '@gorhom/portal';

// ----------- TVA -----------
const menuPanelStyle = tva({
  base: 'absolute rounded-md border p-1 shadow-hard-5 z-50',
  variants: {
    isDark: {
      true: 'bg-[#0E1628] border-[#1E293B]',
      false: 'bg-[#F5F7FB] border-[#CBD5E1]',
    },
  },
});

const itemStyle = tva({
  base: 'p-3 flex-row items-center rounded gap-2 min-w-[180px]',
  variants: {
    isDark: {
      true: 'text-white active:bg-[#1E293B]',
      false: 'text-black active:bg-[#E2E8F0]',
    },
  },
});

// ----------- ITEM -----------
export const MenuItem = ({ className, onPress, children }: any) => {
  const { isDark } = useContext(ThemeToggleContext);
  return (
    <Pressable
      onPress={onPress}
      className={itemStyle({ isDark, class: className })}
    >
      {children}
    </Pressable>
  );
};

export const MenuItemLabel = ({ style, children }: any) => (
  <Text style={style}>{children}</Text>
);

// ----------- MAIN MENU -----------
export const Menu = ({
  trigger,
  placement = 'bottom',
  offset = 6,
  style,
  children,
}: any) => {
  const { isDark } = useContext(ThemeToggleContext);

  const [open, setOpen] = useState(false);
  const [triggerPos, setTriggerPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  return (
    <>
      {/* TRIGGER */}
      <View
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout;
          setTriggerPos({ x, y, w: width, h: height });
        }}
      >
        {trigger({ onPress: () => setOpen(true) })}
      </View>

      {/* MENU */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <Pressable
              className="absolute left-0 right-0 top-0 bottom-0 z-40"
              onPress={() => setOpen(false)}
            />

            {/* POPUP */}
            <Portal>
              <Motion.View
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'timing', duration: 120 }}
                style={[
                  {
                    position: 'absolute',
                    top: triggerPos.y + triggerPos.h + offset,
                    left: triggerPos.x,
                    zIndex: 9999,
                  },
                  style,
                ]}
                className={menuPanelStyle({ isDark })}
              >
                {children}
              </Motion.View>
            </Portal>

          </>
        )}
      </AnimatePresence>
    </>
  );
};
