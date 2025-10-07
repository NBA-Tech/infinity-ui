import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

type Variant =
  | "search"
  | "services"
  | "customers"
  | "orders"
  | "quotations"
  | "invoices"
  | "packages";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  variant?: Variant;
  style?: object;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  secondaryActionLabel,
  onAction,
  onSecondaryAction,
  variant,
  style = {},
}) => {
  const config = useMemo(() => {
    switch (variant) {
      case "search":
        return {
          icon: <Feather name="search" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "No results found",
          description:
            description || "Try adjusting your search terms or explore our photography services.",
          actionLabel: actionLabel || "Clear Filter",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(236,239,255,0.8)"],
        };
      case "packages":
        return {
          icon: <MaterialCommunityIcons name="package-variant-closed" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "No photography packages yet",
          description:
            description ||
            "Create your first photography package to start offering bundled services to clients. Include pricing, session details, and deliverables.",
          actionLabel: actionLabel || "Create Package",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(254,249,231,0.8)"],
        };
      case "services":
        return {
          icon: <MaterialCommunityIcons name="package-variant" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "No photography packages yet",
          description:
            description ||
            "Create your first photography package to start offering services to clients. Include pricing, session details, and deliverables.",
          actionLabel: actionLabel || "Create Package",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(2, 2, 2, 0.8)"],
        };
      case "customers":
        return {
          icon: <Feather name="users" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "No clients in your portfolio",
          description:
            description ||
            "Start building your client base! Add your first client to track their sessions, preferences, and project history.",
          actionLabel: actionLabel || "Add Client",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(219,234,254,0.8)"],
        };
      case "orders":
        return {
          icon: <Feather name="shopping-bag" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "No orders to capture",
          description:
            description ||
            "When clients book your photography services, their orders will appear here. Start promoting your packages to get your first booking!",
          actionLabel: actionLabel || "Create Order",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(220,252,231,0.8)"],
        };
      case "quotations":
        return {
          icon: <Feather name="file-text" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "No quotes in progress",
          description:
            description ||
            "Create professional quotes for potential clients. Include session details, pricing, and terms to win more photography projects.",
          actionLabel: actionLabel || "Create Quote",
          secondaryActionLabel: secondaryActionLabel || "Use Template",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(255,247,237,0.8)"],
        };
      case "invoices":
        return {
          icon: <Feather name="credit-card" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "No invoices to process",
          description:
            description ||
            "Generate professional invoices for completed photography sessions. Track payments and maintain financial records effortlessly.",
          actionLabel: actionLabel || "Create Invoice",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(204,251,241,0.8)"],
        };
      default:
        return {
          icon: <Feather name="alert-circle" size={80} color="rgba(139,92,246,0.6)" />,
          title: title || "Nothing here yet",
          description: description || "Get started by creating your first item.",
          actionLabel: actionLabel || "Get Started",
          bgGradientColors: ["rgba(243,244,246,0.8)", "rgba(236,239,255,0.8)"],
        };
    }
  }, [variant, title, description, actionLabel, secondaryActionLabel]);

  return (
    <ScrollView contentContainerStyle={[styles.container, style]}>
      <LinearGradient colors={config.bgGradientColors} style={styles.iconBackground}>
        {config.icon}
      </LinearGradient>

      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onAction} style={[styles.buttonPrimary, { width: width * 0.6 }]}>
          <Text style={styles.buttonText}>{config.actionLabel}</Text>
        </TouchableOpacity>

        {config.secondaryActionLabel && (
          <TouchableOpacity onPress={onSecondaryAction} style={[styles.buttonSecondary, { width: width * 0.5 }]}>
            <Text style={styles.buttonSecondaryText}>{config.secondaryActionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#7c3aed",
  },
  description: {
    fontFamily: "Inter-Regular",
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buttonPrimary: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7c3aed",
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Inter-Medium",
  },
  buttonSecondary: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    borderRadius: 12,
  },
  buttonSecondaryText: {
    color: "#7c3aed",
    fontWeight: "600",
    fontFamily: "Inter-Medium",
  },
});
