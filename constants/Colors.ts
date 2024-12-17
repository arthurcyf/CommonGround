/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FF6100";
const tintColorDark = "#FF6100";

export const Colors = {
  light: {
    text: "#333333",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#BDBDBD",
    tabIconDefault: "#BDBDBD",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#757575",
    tabIconDefault: "#757575",
    tabIconSelected: tintColorDark,
  },
};
