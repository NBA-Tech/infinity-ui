/// <reference types="nativewind/types" />

import "react";
import "react-native";

// Extend JSX to allow `className` on all native elements
declare module "react" {
  interface Attributes {
    className?: string;
  }
}
