import { Toast } from "toastify-react-native";

export const useToastMessage = () => {
  const showToast = ({
    type = "error",
    title = "Error",
    message = "Something went wrong.",
  }) => {
    Toast.show({
      type,                   // success | error | warning | info | normal
      text1: title,           // Title
      text2: message,         // Message

      position: "top",        // top | bottom
      visibilityTime: 3000,   // Duration
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,

      // 🎨 Colors
      backgroundColor: "#fff",
      textColor: "#000",

      // ✨ Icon options
      iconColor: "#000",
      iconSize: 24,

      // 🎯 Progress Bar
      progressBarColor: "#3B82F6",

      // 🌙 Theme
      theme: "light",        // light | dark

      // ❌ Close icon config
      closeIcon: "times-circle",
      closeIconFamily: "FontAwesome",
      closeIconSize: 18,
      closeIconColor: "#444",
    });
  };

  return showToast;
};
