import { Sun, Moon } from "lucide-react";
import { useTheme, setTheme } from "../lib/theme";
import { copy } from "../content";
export default function ThemeToggle() {
  const theme = useTheme();
  return (
    <button
      type="button"
      className="theme-toggle icon-button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={
        theme === "dark" ? copy.common.themeLight : copy.common.themeDark
      }
      title={theme === "dark" ? copy.common.themeLight : copy.common.themeDark}
    >
      {theme === "dark" ? (
        <Sun size={19} aria-hidden="true" />
      ) : (
        <Moon size={19} aria-hidden="true" />
      )}
    </button>
  );
}
