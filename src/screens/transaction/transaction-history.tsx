'use client';
import React, { useContext, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import BackHeader from '@/src/components/back-header';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';

const TransactionHistory = () => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  // TEMP DATA - Replace with real API response later
  const transactions = [
    {
      id: "TRX12345",
      title: "Premium Subscription - Monthly",
      date: "12 Nov 2025",
      amount: 499,
      type: "debit",
    },
    {
      id: "TRX98112",
      title: "Premium Subscription - Yearly",
      date: "10 Oct 2025",
      amount: 4999,
      type: "debit",
    },
    {
      id: "TRX45212",
      title: "Wallet Top-up",
      date: "05 Sep 2025",
      amount: 1500,
      type: "credit",
    },
    {
      id: "TRX87452",
      title: "Invoice Payment",
      date: "22 Aug 2025",
      amount: 2500,
      type: "debit",
    },
  ];

  /** ------------------------------
   *   🔥 STATS CALCULATION (TEMP)
   * ------------------------------ */
  const stats = useMemo(() => {
    const totalSpent = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReceived = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.length;
    const avgTransaction = totalSpent / (totalTransactions || 1);

    return {
      totalSpent,
      totalReceived,
      totalTransactions,
      avgTransaction,
    };
  }, [transactions]);

  return (
    <View style={globalStyles.appBackground}>
      {/* Header */}
      <BackHeader screenName="Transaction History" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp('4%'),
          paddingBottom: hp('6%'),
          paddingTop: hp('2%'),
        }}
      >

        {/* ------------------------ */}
        {/* 🔵 STATS SECTION */}
        {/* ------------------------ */}
        <Card
          style={[
            globalStyles.cardShadowEffect,
            {
              marginVertical: hp('1%'),
              padding: wp('4%'),
              backgroundColor: isDark ? '#1A2238' : '#FFFFFF',
              borderRadius: wp('4%'),
            },
          ]}
        >
          <Text
            style={[
              globalStyles.heading2Text,
              globalStyles.darkBlueTextColor,
              { marginBottom: hp('1%') },
            ]}
          >
            📊 Summary
          </Text>

          {/* Rows */}
          <View style={{ marginTop: hp('1%'), gap: hp('1.5%') }}>
            <View style={styles.statRow}>
              <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>Total Spent</Text>
              <Text style={[globalStyles.heading3Text, { color: '#DC2626' }]}>₹{stats.totalSpent}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={[globalStyles.normalText, globalStyles.greyTextColor]}>Total Transactions</Text>
              <Text style={[globalStyles.heading3Text, globalStyles.darkBlueTextColor]}>
                {stats.totalTransactions}
              </Text>
            </View>

          </View>
        </Card>

        {/* ------------------------ */}
        {/* 🧾 TRANSACTION LIST */}
        {/* ------------------------ */}
        <View style={{ marginTop: hp('2%') }}>
          <Text
            style={[
              globalStyles.heading2Text,
              globalStyles.darkBlueTextColor,
              { marginBottom: hp('1%') },
            ]}
          >
            Recent Transactions
          </Text>

          {transactions.map((tx, index) => (
            <Card
              key={index}
              style={[
                globalStyles.cardShadowEffect,
                {
                  paddingVertical: hp('2%'),
                  paddingHorizontal: wp('4%'),
                  marginVertical: hp('1%'),
                  backgroundColor: isDark ? '#1A2238' : '#FFFFFF',
                  borderRadius: wp('4%'),
                },
              ]}
            >
              <Text
                style={[
                  globalStyles.heading3Text,
                  globalStyles.themeTextColor,
                ]}
              >
                {tx.title}
              </Text>

              <Text
                style={[
                  globalStyles.smallText,
                  globalStyles.greyTextColor,
                  { marginTop: 3 },
                ]}
              >
                {tx.date}
              </Text>

              <Text
                style={[
                  globalStyles.heading3Text,
                  {
                    marginTop: hp('1%'),
                    color: tx.type === "debit" ? "#DC2626" : "#16A34A",
                  },
                ]}
              >
                {tx.type === "debit" ? "-" : "+"}₹{tx.amount}
              </Text>

              <Text
                style={[
                  globalStyles.smallText,
                  { marginTop: 5, color: "#6B7280" },
                ]}
              >
                Transaction ID: {tx.id}
              </Text>
            </Card>
          ))}

          {/* FOOTER */}
          <View className="mt-6 mb-10 items-center">
            <Text
              style={[
                globalStyles.smallText,
                globalStyles.greyTextColor,
                { textAlign: "center", width: wp("80%") },
              ]}
            >
              📦 More transactions will appear here as you continue using the platform.
            </Text>
          </View>
        </View>

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
