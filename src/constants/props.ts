import { colors } from "../config/theme";

export const ViewProps = {
  _dark: { bg: colors.brand.darker },
  _light: { bg: colors.brand.light },
};

export const SettingsPressableProps = {
  _dark: { borderColor: "muted.800" },
  _light: { borderColor: "muted.200" },
  px: 4,
  py: 3,
};

export const HStackProps = {
  _dark: { borderColor: "muted.800" },
  _light: { borderColor: "muted.200" },
  justifyContent: "space-between",
  alignItems: "center",
  px: 3,
  py: 2,
};

export const VStackProps = {
  _light: { bg: "muted.200" },
  _dark: { bg: "muted.900" },
};

export const SelectProps = {
  minW: 20,
  variant: "filled" as any,
  _dark: {
    bg: "muted.900",
    color: "white",
    placeholderTextColor: "muted.400",
    _selectedItem: { bg: "muted.800" },
  },
  _light: {
    bg: "muted.100",
    color: "black",
    placeholderTextColor: "muted.900",
    _selectedItem: { bg: "muted.200" },
  },
  _actionSheetContent: {
    _dark: { bg: "muted.900" },
    _light: { bg: "muted.100" },
  },
  _actionSheetBody: { _dark: { bg: "muted.900" }, _light: { bg: "muted.100" } },
  _backdrop: { opacity: 0.8 },
};

export const PressableProps = {
  w: "100%",
  _dark: { borderColor: "muted.800" },
  _light: { borderColor: "muted.200" },
  _pressed: { opacity: 0.5 },
  _disabled: { opacity: 0.5 },
  m: 0,
  p: 0,
};

export const ActionSheetProps = {
  _dark: { bg: "muted.900", color: "muted.100" },
  _light: { bg: "muted.100", color: "muted.900" },
};

export const ButtonProps = {
  _text: { fontSize: 16, fontWeight: "medium" },
  _light: { bg: "muted.900", _text: { color: "muted.100" } },
  _dark: { bg: "muted.100", _text: { color: "muted.900" } },
  _pressed: { opacity: 0.75, bg: "muted.400" },
  _loading: { bg: "muted.900", _text: { color: "muted.100" } },
  rounded: 10,
  py: 5,
};

export const InputProps = {
  fontSize: 14,
  variant: "filled" as any,
  borderWidth: 0,
  _light: { bg: "muted.200", _focus: { bg: "muted.200" } },
  _dark: { bg: "muted.900", _focus: { bg: "muted.900" } },
  py: 3,
  rounded: 10,
};

export const DividerProps = {
  _dark: { bg: "muted.800" },
  _light: { bg: "muted.200" },
};

export const DetailsProps = {
  justifyContent: "space-between",
  my: 4,
};