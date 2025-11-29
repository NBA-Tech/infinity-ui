'use client';
import React from 'react';
import { View } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';

// Context namespace
const SCOPE = 'PROGRESS';

/* ---------------------- STYLES ---------------------- */

const progressStyle = tva({
  base: 'bg-background-300 rounded-full overflow-hidden w-full',
  variants: {
    size: {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
      xl: 'h-5',
    },
  },
});

const filledTrackStyle = tva({
  base: 'bg-primary-500 rounded-full h-full',
});

/* ---------------------- COMPONENTS ---------------------- */

type IProgressProps = {
  value?: number;
  min?: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof View>;

// Use context-capable wrapper
const ProgressRoot = withStyleContext(View, SCOPE);

export const Progress = React.forwardRef<any, IProgressProps>(
  function Progress(
    {
      value = 0,
      min = 0,
      max = 100,
      size = 'md',
      className,
      style,
      children,
      ...props
    },
    ref
  ) {
    const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return (
      <ProgressRoot
        ref={ref}
        {...props}
        className={progressStyle({ size, class: className })}
        style={[{ position: 'relative' }, style]}
        context={{ percent, size }} // context provided here
      >
        {children}
      </ProgressRoot>
    );
  }
);

export const ProgressFilledTrack = React.forwardRef<any, any>(
  function ProgressFilledTrack({ className, style, ...props }, ref) {
    const ctx = useStyleContext(SCOPE);

    const percent = ctx?.percent ?? 0;

    return (
      <View
        ref={ref}
        className={filledTrackStyle({ class: className })}
        style={[
          {
            width: `${percent}%`,
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
          },
          style,
        ]}
        {...props}
      />
    );
  }
);

Progress.displayName = 'Progress';
ProgressFilledTrack.displayName = 'ProgressFilledTrack';
