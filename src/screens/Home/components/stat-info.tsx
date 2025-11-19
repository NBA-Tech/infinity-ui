import React, { useContext, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@/components/ui/card";
import {
  StyleContext,
  ThemeToggleContext,
} from "@/src/providers/theme/global-style-provider";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Invoice } from "@/src/types/invoice/invoice-type";
import { InvestmentModel } from "@/src/types/investment/investment-type";
import { ApprovalStatus, OrderModel } from "@/src/types/order/order-type";
import { useUserStore } from "@/src/store/user/user-store";

interface DashboardStatsProps {
  invoices: Invoice[];
  investments: InvestmentModel[];
  orders: OrderModel[];
  loading: boolean;
}

export const DashboardStats = (props: DashboardStatsProps) => {
  const globalStyles = useContext(StyleContext);
  const { userDetails } = useUserStore();
  const { isDark } = useContext(ThemeToggleContext);

  const { orders, invoices, investments, loading } = props;

  /** ---------------------------------------------------
   *  CALCULATE STATS (Memoized)
   *  --------------------------------------------------- */
  const stats = useMemo(() => {

    // --- Total Paid ---
    const totalPayed = invoices?.reduce(
      (sum, invoice) => sum + Number(invoice?.amountPaid ?? 0),
      0
    );
  
    // --- Total Investment ---
    const totalInvestment = investments?.reduce(
      (sum, inv) => sum + Number(inv?.investedAmount ?? 0),
      0
    );
  
    // --- Accepted Orders ----
    const acceptedOrders = orders?.filter(
      (o) => o.approvalStatus === ApprovalStatus.ACCEPTED
    ) || [];
  
    const totalOrders = acceptedOrders.length;
  
    // --- Total Receivable from Accepted Orders ---
    const totalOrderReceivables = acceptedOrders.reduce(
      (sum, order) => sum + Number(order?.totalPrice ?? 0),
      0
    );
  
    // --- Pending Quotes ----
    const totalQuotes = orders?.filter(
      (o) => o.approvalStatus === ApprovalStatus.PENDING
    ).length ?? 0;
  
    // --- Outstanding = Total Receivable - Already Paid ---
    const outstandingReceivables = Math.max(totalOrderReceivables - totalPayed, 0);
  
    return {
      totalOrderReceivables: outstandingReceivables, // FINAL OUTSTANDING RECEIVABLE
      totalPayed,
      totalInvestment,
      totalOrders,
      totalQuotes,
    };
  }, [orders, invoices, investments]);
  


  /** ---------------------------------------------------
   *  THEME COLORS
   *  --------------------------------------------------- */
  const leftCardBg = isDark ? "#1E293B" : "#EAF3FF";
  const rightBoxBg = isDark ? "rgba(239, 68, 68, 0.15)" : "#FBEAEA";
  const rightBoxHeading = isDark ? "#F9FAFB" : "#111827";
  const rightBoxSub = isDark ? "#CBD5E1" : "#6B7280";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: wp("96%"),
        alignSelf: "center",
        marginTop: hp("2%"),
        marginBottom: hp("2%"),
      }}
    >
      {/* LEFT CARD ----------------------------------------------- */}
      <Card
        style={{
          width: wp("58%"),
          paddingVertical: hp("2%"),
          paddingHorizontal: wp("4%"),
          borderRadius: wp("5%"),
          backgroundColor: leftCardBg,
        }}
      >
        {/* Receivables */}
        <Text style={[globalStyles.heading3Text, globalStyles.greyTextColor]}>
          Total Receivables
        </Text>
        <Text
          style={[
            globalStyles.heading2Text,
            globalStyles.darkBlueTextColor,
            { marginTop: hp("0.5%") },
          ]}
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              {userDetails?.currencyIcon} {stats.totalOrderReceivables}
            </>
          )}
        </Text>

        <View style={{ height: hp("2%") }} />

        {/* Investments */}
        <Text style={[globalStyles.heading3Text, globalStyles.greyTextColor]}>
          Total Invested
        </Text>
        <Text
          style={[
            globalStyles.heading2Text,
            globalStyles.darkBlueTextColor,
            { marginTop: hp("0.5%") },
          ]}
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              {userDetails?.currencyIcon} {stats.totalInvestment}
            </>
          )}
        </Text>
      </Card>

      {/* RIGHT SIDE BOXES ------------------------------------- */}
      <View style={{ width: wp("36%"), justifyContent: "space-between" }}>
        {/* Total Orders */}
        <TouchableOpacity>
          <Card
            style={{
              paddingVertical: hp("2%"),
              paddingHorizontal: wp("4%"),
              borderRadius: wp("5%"),
              backgroundColor: rightBoxBg,
            }}
          >
            <Text
              style={[
                globalStyles.heading2Text,
                { color: rightBoxHeading, marginBottom: hp("0.5%") },
              ]}
            >
              {loading ? "..." : stats.totalOrders}
            </Text>
            <Text style={[globalStyles.smallText, { color: rightBoxSub }]}>
              Total Orders
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Pending Quotes */}
        <TouchableOpacity style={{ marginTop: hp("2%") }}>
          <Card
            style={{
              paddingVertical: hp("2%"),
              paddingHorizontal: wp("4%"),
              borderRadius: wp("5%"),
              backgroundColor: rightBoxBg,
            }}
          >
            <Text
              style={[
                globalStyles.heading2Text,
                { color: rightBoxHeading, marginBottom: hp("0.5%") },
              ]}
            >
              {loading ? "..." : stats.totalQuotes}
            </Text>
            <Text style={[globalStyles.smallText, { color: rightBoxSub }]}>
              Pending Quotes
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardStats;
