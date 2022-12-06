export const HStackProps = {
	_dark: {bg: "muted.900", borderColor: "muted.800"},
	_light: {bg: "muted.100", borderColor: "muted.200"},
	justifyContent: "space-between",
	alignItems: "center",
	borderBottomWidth: 1,
	px: 3,
	py: 3,
}

export const SelectProps = {
	minW: 20,
	variant: "filled" as any,
	_dark: {bg: "muted.900", color: "white", placeholderTextColor: "muted.400", _selectedItem: {bg: "muted.800"}},
	_light: {bg: "muted.100", color: "black", placeholderTextColor: "muted.900", _selectedItem: {bg: "muted.200"}},
	_actionSheetContent: {_dark: {bg: "muted.900"}, _light: {bg: "muted.100"}},
	_actionSheetBody: {_dark: {bg: "muted.900"}, _light: {bg: "muted.100"}},
	_backdrop: {opacity: 0.8},
}

export const PressableProps = {
	w: "100%",
	_dark: {bg: "muted.900", borderColor: "muted.800"},
	_light: {bg: "muted.100", borderColor: "muted.200"},
	borderTopWidth: 1,
	borderBottomWidth: 1,
	_pressed: {opacity: 0.5},
	m: 0,
	p: 0,
}

export const ActionSheetProps = {
	_dark: {bg: "muted.900", color: "muted.100"},
	_light: {bg: "muted.100", color: "muted.900"},
}

export const ButtonProps = {
	fontSize: 12,
	_light: {bg: "muted.900", _text: {color: "muted.100"}},
	_dark: {bg: "muted.100", _text: {color: "muted.900"}},
	_pressed: {opacity: 0.8, bg: "muted.400"},
	_loading: {bg: "muted.900", _text: {color: "muted.100"}},
	rounded: 8,
	py: 5,
}

export const InputProps = {
	fontSize: 14,
	variant: "filled" as any,
	borderWidth: 0,
	_light: {bg: "muted.200", _focus: {bg: "muted.200"}},
	_dark: {bg: "muted.900", _focus: {bg: "muted.900"}},
	py: 5,
	rounded: 8,
}