import React, { useContext, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { scaleFont } from "../styles/global";
import { StyleContext } from "../providers/theme/global-style-provider";

const { width } = Dimensions.get("window");

type Variant =
  | "search"
  | "services"
  | "customers"
  | "orders"
  | "quotations"
  | "invoices"
  | "packages"
  | "deliverables";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  variant?: Variant;
  style?: object;
  noAction?: boolean;
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
  noAction = false,
}) => {
  const globalStyles = useContext(StyleContext);

  const gradientMap: Record<string, string[]> = {
    search: ["#F3F4F6CC", "#DBEAFFCC"],
    packages: ["#F3F4F6CC", "#CCFCF1CC"],
    services: ["#F3F4F6CC", "#CCFCF1CC"],
    customers: ["#F3F4F6CC", "#DBEAFFCC"],
    orders: ["#F3F4F6CC", "#CCFCF1CC"],
    quotations: ["#F3F4F6CC", "#FFF7EDCC"],
    invoices: ["#F3F4F6CC", "#CCFCF1CC"],
    deliverables: ["#F3F4F6CC", "#CCFCF1CC"],
    default: ["#F3F4F6CC", "#ECF0FFCC"],
  };

  const variantConfigMap: Record<string, any> = {
    search: {
      icon: <Feather name="search" size={80} color="#142850" />,
      defaultTitle: "No results found",
      defaultDescription: "Try adjusting your search terms or explore our photography services.",
      defaultActionLabel: "Clear Filter",
    },
    packages: {
      icon: <MaterialCommunityIcons name="package-variant-closed" size={80} color="#142850" />,
      defaultTitle: "No photography packages yet",
      defaultDescription: "Create your first photography package to start offering bundled services to clients. Include pricing, session details, and deliverables.",
      defaultActionLabel: "Create Package",
    },
    services: {
      icon: <MaterialCommunityIcons name="package-variant" size={80} color="#142850" />,
      defaultTitle: "No photography services yet",
      defaultDescription: "Create your first photography service to start offering bundled services to clients. Include pricing, session details, and deliverables.",
      defaultActionLabel: "Create Service",
    },
    customers: {
      icon: <Feather name="users" size={80} color="#142850" />,
      defaultTitle: "No clients in your portfolio",
      defaultDescription: "Start building your client base! Add your first client to track their sessions, preferences, and project history.",
      defaultActionLabel: "Add Client",
    },
    orders: {
      icon: <Feather name="shopping-bag" size={80} color="#142850" />,
      defaultTitle: "No orders to capture",
      defaultDescription: "When clients book your photography services, their orders will appear here. Start promoting your packages to get your first booking!",
      defaultActionLabel: "Create Order",
    },
    quotations: {
      icon: <Feather name="file-text" size={80} color="#142850" />,
      defaultTitle: "No quotes in progress",
      defaultDescription: "Create professional quotes for potential clients. Include session details, pricing, and terms to win more photography projects.",
      defaultActionLabel: "Create Quote",
    },
    invoices: {
      icon: <Feather name="credit-card" size={80} color="#142850" />,
      defaultTitle: "No invoices to process",
      defaultDescription: "Generate professional invoices for completed photography sessions. Track payments and maintain financial records effortlessly.",
      defaultActionLabel: "Create Invoice",
    },
    deliverables: {
      icon: <Feather name="image" size={80} color="#142850" />,
      defaultTitle: "No deliverables uploaded yet",
      defaultDescription: "Upload your edited photos, videos, or albums here. Deliver beautiful final outputs to your clients with ease.",
      defaultActionLabel: "Add Deliverable",
    },
    default: {
      icon: <Feather name="alert-circle" size={80} color="#142850" />,
      defaultTitle: "Nothing here yet",
      defaultDescription: "Get started by creating your first item.",
      defaultActionLabel: "Get Started",
    },
  };

  const config = useMemo(() => {
    const base = variantConfigMap[variant || "default"] || variantConfigMap.default;

    return {
      icon: base.icon,
      title: title || base.defaultTitle,
      description: description || base.defaultDescription,
      actionLabel: actionLabel || base.defaultActionLabel,
      secondaryActionLabel: secondaryActionLabel || base.secondaryActionLabel,
      bgGradientColors: gradientMap[variant || "default"],
    };
  }, [variant, title, description, actionLabel, secondaryActionLabel]);

  return (
    <ScrollView contentContainerStyle={[styles.container, style]}>
      <LinearGradient colors={config.bgGradientColors} style={styles.iconBackground}>
        {config.icon}
      </LinearGradient>

      <Text style={[styles.title, globalStyles.darkBlueTextColor]}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>

      {!noAction && (
        <View style={styles.buttonsContainer}>
          {config.actionLabel && (
            <TouchableOpacity onPress={onAction} style={[styles.buttonPrimary, { width: width * 0.6 }]}>
              <Text style={styles.buttonText}>{config.actionLabel}</Text>
            </TouchableOpacity>
          )}
          {config.secondaryActionLabel && (
            <TouchableOpacity onPress={onSecondaryAction} style={[styles.buttonSecondary, { width: width * 0.5 }]}>
              <Text style={styles.buttonSecondaryText}>{config.secondaryActionLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    fontSize: scaleFont(18),
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "OpenSans-Bold",
  },
  description: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
    fontSize: scaleFont(14),
    lineHeight: 22,
    fontFamily: "OpenSans-Regular",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buttonPrimary: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C426A",
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "OpenSans-SemiBold",
    fontSize: scaleFont(14),
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
  },
});
