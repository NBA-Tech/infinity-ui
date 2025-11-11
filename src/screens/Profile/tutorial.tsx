'use client';
import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import BackHeader from '@/src/components/back-header';
const Tutorial = () => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  const videos = [
    {
      id: 'LXb3EKWsInQ',
      title: 'Getting Started with Our Platform',
      description:
        'Learn how to set up your account, navigate the dashboard, and understand the key features in under 5 minutes.',
    },
    {
      id: 'ysz5S6PUM-U',
      title: 'Understanding Our Service Packages',
      description:
        'A quick overview of our various packages, including pricing and benefits tailored to different business needs.',
    },
    {
      id: 'HhesaQXLuRY',
      title: 'How to Manage Your Orders',
      description:
        'Step-by-step walkthrough on managing your active orders, tracking progress, and handling invoices efficiently.',
    },
    {
      id: 'ScMzIvxBSi4',
      title: 'Tips for Maximizing Value',
      description:
        'Expert tips on how to make the most of our services, with a focus on time-saving workflows and advanced tools.',
    },
    {
      id: 'VYOjWnS4cMY',
      title: 'Support & Troubleshooting Guide',
      description:
        'Need help? This video explains our support process, FAQs, and common troubleshooting steps to keep you running smoothly.',
    },
  ];

  return (
    <View style={globalStyles.appBackground}>
      {/* ✅ Header with Back Button */}
      <BackHeader screenName="Tutorials" />

      <ScrollView
        contentContainerStyle={{
          paddingVertical: hp('2%'),
          paddingHorizontal: wp('4%'),
          paddingBottom: hp('5%'),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section */}
        <View className="mb-6 mt-2">
          <Text style={[globalStyles.heading2Text, globalStyles.darkBlueTextColor]}>
            🎓 Learn With Us
          </Text>
          <Text
            style={[
              globalStyles.normalText,
              globalStyles.greyTextColor,
              { marginTop: 6, width: '92%' },
            ]}
          >
            Watch these quick videos to get the most out of our platform — from setup to expert tips.
          </Text>
        </View>

        {/* Video Cards */}
        {videos.map((video, index) => (
          <View
            key={index}
            className="mb-5 rounded-2xl"
            style={[
              globalStyles.cardShadowEffect,
              {
                paddingVertical: hp('2%'),
                paddingHorizontal: wp('3.5%'),
                backgroundColor: isDark ? '#1A2238' : '#FFFFFF',
                marginVertical: hp('2%'),
              },
            ]}
          >
            {/* Card Title */}
            <Text
              style={[
                globalStyles.heading3Text,
                globalStyles.darkBlueTextColor,
                { marginBottom: 4 },
              ]}
            >
              {video.title}
            </Text>

            {/* Description */}
            <Text
              style={[
                globalStyles.normalText,
                globalStyles.greyTextColor,
                { marginBottom: hp('1%') },
              ]}
            >
              {video.description}
            </Text>

            {/* YouTube Player */}
            <View
              className="rounded-xl overflow-hidden mt-2"
              style={{
                borderWidth: 1,
                borderColor: isDark ? '#2E3A57' : '#E5E7EB',
                backgroundColor: isDark ? '#0E1628' : '#F5F7FB',
              }}
            >
              <YoutubePlayer height={hp('22%')} play={false} videoId={video.id} />
            </View>
          </View>
        ))}

        {/* Footer Message */}
        <View className="mt-6 mb-10 items-center">
          <Text
            style={[
              globalStyles.smallText,
              globalStyles.greyTextColor,
              { textAlign: 'center', width: wp('80%') },
            ]}
          >
            🚀 More tutorials are coming soon. Stay tuned for in-depth guides and updates!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Tutorial;
