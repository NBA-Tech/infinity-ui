// Card.tsx
import React, { useContext } from 'react';
import { View, ViewProps } from 'react-native';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { createCardStyle } from './styles';
import { ThemeToggleContext } from '@/src/providers/theme/global-style-provider';

type ICardProps = ViewProps &
  VariantProps<ReturnType<typeof createCardStyle>> & {
    className?: string;
  };

const Card = React.forwardRef<React.ComponentRef<typeof View>, ICardProps>(
  function Card({ className, size = 'md', variant = 'elevated', ...props }, ref) {
    const { isDark } = useContext(ThemeToggleContext);
    const cardStyle = createCardStyle(isDark);

    return (
      <View
        className={cardStyle({ size, variant, class: className })}
        {...props}
        ref={ref}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
