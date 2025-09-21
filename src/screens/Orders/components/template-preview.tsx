import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { widthPercentageToDP as wp,heightPercentageToDP as hp } from 'react-native-responsive-screen';
type TemplatePreviewProps = {
    html: string
}
const htmlClassesStyles = {
  body: {
    fontFamily: "Inter-Regular",
    margin: 0,
    padding: 0,
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    lineHeight: 28, // more breathing space
    fontSize: 16,
  },
  container: {
    maxWidth: 850,
    marginVertical: 30,
    marginHorizontal: "auto",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  header: {
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    paddingVertical: 28,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    fontFamily: "Poppins-Bold",
  },
  "studio-info": {
    maxWidth: "65%",
    fontFamily: "Poppins-Bold",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  "contact-info": {
    textAlign: "right",
    fontSize: 15,
    color: "#ffffff",
    fontFamily: "Inter-Regular",
  },
  col:{
    paddingHorizontal:wp('4%')
  },
  metadata: {
    flexDirection: "col",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#eef2ff",
    borderRadius: 14,
    marginTop: 20,
    fontWeight: "600",
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#c7d2fe",
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  section: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  h2: {
    marginBottom: 14,
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    fontWeight: "600",
    color: "#1f2937",
    borderLeftWidth: 5,
    borderLeftColor: "#6366f1",
    paddingLeft: 12,
  },
  card: {
    backgroundColor: "#f0f4ff",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  field: {
    marginBottom: 12,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#111827",
  },
  "field span": {
    fontWeight: "600",
    fontFamily: "Poppins-Bold",
    color: "#1f2937",
  },
  "pricing-container": {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  "pricing-row": {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    gap:wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },
  desc: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#1f2937",
  },
  heading:{
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Bold",
    color: "#1f2937",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Bold",
    color: "#111827",
  },
  "package-row": {
    backgroundColor: "#e0e7ff",
    fontWeight: "600",
    color: "#4338ca",
    fontFamily: "Poppins-Bold",
  },
  "sub-service .desc": {
    paddingLeft: 24,
    fontStyle: "italic",
    color: "#6b7280",
    fontFamily: "Inter-Regular",
  },
  "total-row": {
    backgroundColor: "#f3f4f6",
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
    color: "#111827",
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#f3f4f6",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    color: "#4b5563",
    textAlign: "center",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 30,
  },
  "signature-box": {
    marginTop: 24,
    padding: 18,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    borderRadius: 10,
    textAlign: "center",
    color: "#6b7280",
    fontStyle: "italic",
    fontFamily: "Inter-Regular",
  },
  "grand-total": {
    fontWeight: "bold",
    backgroundColor: "#f3f4f6",
    borderTopWidth: 2,
    borderTopColor: "#d1d5db",
    fontFamily: "Poppins-Bold",
  },
};




const TemplatePreview = (props: TemplatePreviewProps) => {
    const { width } = useWindowDimensions();
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#f3f4f6" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <ScrollView
                horizontal
                contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={true}
            >
                <View style={{ minWidth: width }}>
                    <RenderHTML
                        contentWidth={width}
                        source={{ html: props?.html }}
                        classesStyles={htmlClassesStyles}
                        systemFonts={["Poppins-Bold", "Inter-Regular"]}
                    />
                </View>
            </ScrollView>
        </ScrollView>
    );
};

export default TemplatePreview;