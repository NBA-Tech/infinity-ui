'use client';
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BackHeader from '@/src/components/back-header';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/src/store/user/user-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { getTransactionListAPI } from '@/src/api/payment/payment-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { PaymentModel } from '@/src/types/payment/payment-type';
import Skeleton from '@/components/ui/skeleton';
import { EmptyState } from '@/src/components/empty-state-data';
import { formatDate } from '@/src/utils/utils';
const TransactionHistory = () => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);
  const { getItem } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const showToast = useToastMessage();
  const {userDetails}=useUserStore()

  const TransactionCard = ({ item }: { item: PaymentModel }) => {
    const isSuccess = item.paymentStatus === "SUCCESS";
    const isPending = item.paymentStatus === "PENDING";
    const isFailed = item.paymentStatus === "FAILED";
  
    // Choose badge color based on status
    const statusColor = isSuccess
      ? "#16A34A" // green
      : isPending
      ? "#F59E0B" // yellow
      : "#DC2626"; // red
  
    return (
      <Card
        style={[
          globalStyles.cardShadowEffect,
          {
            paddingVertical: hp("2%"),
            paddingHorizontal: wp("4%"),
            marginVertical: hp("1%"),
            backgroundColor: isDark ? "#1A2238" : "#FFFFFF",
            borderRadius: wp("4%"),
            borderLeftWidth: 5,
            borderLeftColor: statusColor,
          },
        ]}
      >
        {/* TOP ROW → Amount + Status Badge */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>
            {userDetails?.currencyIcon} {item.amount}
          </Text>
  
          {/* STATUS BADGE */}
          <View
            style={{
              paddingVertical: 4,
              paddingHorizontal: 10,
              backgroundColor: statusColor + "20",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: statusColor,
                fontWeight: "600",
                fontSize: wp("3.5%"),
                textTransform: "capitalize",
              }}
            >
              {item.paymentStatus}
            </Text>
          </View>
        </View>
  
        {/* DATE */}
        <Text
          style={[
            globalStyles.smallText,
            globalStyles.greyTextColor,
            { marginTop: 6 },
          ]}
        >
          {formatDate(item.createdDate)}
        </Text>
  
        {/* PAYMENT ID */}
        <Text
          style={[
            globalStyles.smallText,
            { marginTop: 8, color: "#6B7280" },
          ]}
        >
          Payment ID: {item.paymentId}
        </Text>
      </Card>
    );
  };
  

  // -------------------------------
  // Skeleton Loader Component
  // -------------------------------
  const OrderCardSkeleton = ({ count }: { count: number }) => (
    <View className="flex flex-col justify-between">
      {[...Array(count)].map((_, index) => (
        <View key={index}>
          <Skeleton
            style={{
              width: wp("96%"),
              height: hp("12%"),
              borderRadius: wp("3%"),
            }}
          />
        </View>
      ))}
    </View>
  );

  // -------------------------------
  // Fetch Transactions
  // -------------------------------
  const getTransactionList = async () => {
    const userId = getItem("USERID");
    if (!userId) return;

    try {
      setLoading(true);
      const response = await getTransactionListAPI(userId);

      if (!response?.success) {
        showToast({
          type: "error",
          title: "Error",
          message: response?.message,
        });
      } else {
        setTransactions(response?.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactionList();
  }, []);

  // -------------------------------
  // Summary Calculations
  // -------------------------------
  const summary = useMemo(() => {
    const totalSpent = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    return {
      totalSpent,
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <View style={globalStyles.appBackground}>
      <BackHeader screenName="Transaction History" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp("2%"),
          paddingBottom: hp("6%"),
          paddingTop: hp("2%"),
        }}
      >
        {/* SUMMARY CARD */}
        <Card
          style={[
            globalStyles.cardShadowEffect,
            {
              marginVertical: hp("1%"),
              padding: wp("4%"),
              backgroundColor: isDark ? "#1A2238" : "#FFFFFF",
              borderRadius: wp("4%"),
            },
          ]}
        >
          <Text
            style={[
              globalStyles.heading2Text,
              globalStyles.darkBlueTextColor,
              { marginBottom: hp("1%") },
            ]}
          >
            Summary
          </Text>

          <View style={{ marginTop: hp("1%"), gap: hp("1.5%") }}>
            <View style={styles.statRow}>
              <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>
                Total Spent
              </Text>
              <Text style={[globalStyles.heading3Text, { color: "#DC2626" }]}>
                ₹{summary.totalSpent}
              </Text>
            </View>

            <View style={styles.statRow}>
              <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>
                Total Transactions
              </Text>
              <Text style={[globalStyles.heading3Text, globalStyles.darkBlueTextColor]}>
                {summary.totalTransactions}
              </Text>
            </View>
          </View>
        </Card>

        {/* LIST SECTION */}
        <Text
          style={[
            globalStyles.heading2Text,
            globalStyles.darkBlueTextColor,
            { marginBottom: hp("1%"), marginTop: hp("2%") },
          ]}
        >
          Recent Transactions
        </Text>

        {/* LOADING */}
        {loading && <OrderCardSkeleton count={4} />}

        {/* EMPTY STATE */}
        {!loading && transactions.length === 0 && (
          <EmptyState variant="orders" />
        )}

        {/* TRANSACTION LIST */}
        {!loading && transactions.length > 0 && (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.paymentId}
            renderItem={({ item }) => (
              <TransactionCard item={item} />
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
};

export default TransactionHistory;
