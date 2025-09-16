import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
type TemplatePreviewProps = {
    html: string
}
const htmlClassesStyles = {
    body: {
        fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: "#f3f4f6",
        color: "#1f2937",
        lineHeight: 24,
    },
    container: {
        maxWidth: 850,
        marginVertical: 20,
        marginHorizontal: "auto",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 6,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    header: {
        backgroundColor: "#4f46e5", // deeper purple
        color: "#ffffff",
        paddingVertical: 20,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 12,
    },
    "studio-info": {
        maxWidth: "60%",
    },
    logo: {
        width: '2',
        height:'2'
    },
    "contact-info": {
        textAlign: "right",
        fontSize: 14,
        color: "#ffffff",
    },
    metadata: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#eef2ff", // soft blue
        borderRadius: 12,
        marginTop: 16,
        fontWeight: "600",
        color: "#1f2937",
        borderWidth: 1,
        borderColor: "#c7d2fe",
    },
    section: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    h2: {
        marginBottom: 12,
        fontSize: 22,
        color: "#1f2937",
        borderLeftWidth: 4,
        borderLeftColor: "#6366f1",
        paddingLeft: 10,
    },
    card: {
        backgroundColor: "#f0f4ff",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#dbeafe",
    },
    field: {
        marginBottom: 10,
        fontSize: 15,
        color: "#111827",
    },
    "field span": {
        fontWeight: "600",
        color: "#1f2937",
    },
    "pricing-container": {
        width: "100%",
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#ffffff",
    },
    "pricing-row": {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    "pricing-row:last-child": {
        borderBottomWidth: 0,
    },
    desc: {
        fontSize: 15,
        color: "#1f2937",
    },
    amount: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },
    "package-row": {
        backgroundColor: "#e0e7ff",
        fontWeight: "600",
        color: "#4338ca",
    },
    "sub-service .desc": {
        paddingLeft: 20,
        fontStyle: "italic",
        color: "#6b7280",
    },
    "total-row": {
        backgroundColor: "#f3f4f6",
        fontWeight: "700",
        color: "#111827",
    },
    footer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: "#f3f4f6",
        fontSize: 14,
        color: "#4b5563",
        textAlign: "center",
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
        marginTop: 24,
    },
    "signature-box": {
        marginTop: 20,
        padding: 15,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#d1d5db",
        borderRadius: 8,
        textAlign: "center",
        color: "#6b7280",
        fontStyle: "italic",
    },
};




const TemplatePreview = (props: TemplatePreviewProps) => {
    const { width } = useWindowDimensions();
    console.log(props?.html)
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
                    />
                </View>
            </ScrollView>
        </ScrollView>
    );
};

export default TemplatePreview;