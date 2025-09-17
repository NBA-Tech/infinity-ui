import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  color = '#e0e0e0',
  shimmer = true,
  duration = 1000,
  style = {},
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (shimmer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [shimmer, duration]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: color,
          opacity: shimmer ? opacity : 1,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 4,
  },
});

export default Skeleton;
