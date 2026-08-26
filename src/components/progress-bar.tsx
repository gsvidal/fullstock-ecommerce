import { useNavigation } from "react-router";

export default function ProgressBar() {
  const navigation = useNavigation();
  const idle = navigation.state === "idle";

  return (
    <div
      className={`relative z-10 -mb-1 h-1 bg-primary-background ${
        idle
          ? "w-full opacity-0 transition-[width,opacity] duration-250"
          : "w-0 animate-[progress-bar_8s_ease-out_forwards] opacity-100 transition-none"
      }`}
    />
  );
}
