import { Form } from "react-bootstrap";
import useTheme from "../../theme/useTheme";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Form.Check
      type="switch"
      id="theme-switch"
      checked={theme === "dark"}
      onChange={toggleTheme}
      style={{ fontSize: "1.8rem" }}
    />
  );
};

export default ThemeSwitch;
