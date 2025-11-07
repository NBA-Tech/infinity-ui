'use client';
import { ActivityIndicator } from 'react-native';
import React from 'react';
import { cssInterop } from 'nativewind';

cssInterop(ActivityIndicator, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
});


const Spinner = React.forwardRef<
  React.ComponentRef<typeof ActivityIndicator>,
  React.ComponentProps<typeof ActivityIndicator>
>(function Spinner(
  {
    className,
    color,
    focusable = false,
    'aria-label': ariaLabel = 'loading',
    ...props
  },
  ref
) {
  return (
    <ActivityIndicator
      ref={ref}
      focusable={focusable}
      aria-label={ariaLabel}
      {...props}
      color={color}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner };
