import React, { useCallback, useState } from 'react';
import { LayoutAnimation, TextStyle, View, ViewStyle } from 'react-native';
import DropDownPicker, {
  ItemType,
  ListModeType,
  RenderListItemPropsInterface,
  ValueType,
} from 'react-native-dropdown-picker';
import { useTheme } from '../../hook/theme.hook';

interface DropdownPickerStyle {
  container?: ViewStyle;
  labelStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  listItemLabelStyle?: TextStyle;
  selectedItemLabelStyle?: TextStyle;
  dropDownContainerStyle?: ViewStyle;
  selectedItemContainerStyle?: ViewStyle;
  placeholderStyle?: TextStyle;
}

interface DropdownPickerProps {
  open?: boolean;
  modalProps?: any;
  animation?: boolean;
  disabled?: boolean;
  modalTitle?: string;
  placeholder?: string;
  onClose?: () => void;
  onOpen?: () => void;
  listMode?: ListModeType;
  modalTitleStyle?: TextStyle;
  style?: DropdownPickerStyle;
  toggleDropdown?: () => void;
  defaultValue?: string | number;
  items: ItemType<string | number>[];
  modalContentContainerStyle?: ViewStyle;
  onSelect?: (item: ItemType<string | number>) => void;
  value: number | string | null;
  renderListItem?: (props: RenderListItemPropsInterface<string | number>) => React.JSX.Element;
}

export const DropdownPicker = ({
  open,
  modalProps,
  style,
  animation,
  disabled,
  modalTitle,
  placeholder,
  onClose,
  onOpen,
  listMode,
  defaultValue,
  items,
  onSelect,
  value,
  renderListItem,
}: DropdownPickerProps) => {
  const [isOpen, setOpen] = useState(false);
  const [itemsList, setItemsList] = useState(items);
  const [_value, setValue] = useState(defaultValue ?? null);

  const theme = useTheme();

  const styles = { ...theme.dropdown, ...style };

  return (
    <View style={style?.container}>
      <DropDownPicker
        zIndex={100}
        searchable={false}
        translation={{
          PLACEHOLDER: placeholder,
        }}
        open={isOpen}
        value={value}
        items={itemsList}
        onOpen={onOpen}
        setOpen={setOpen}
        onClose={onClose}
        disabled={disabled}
        listMode={listMode}
        setItems={setItemsList}
        onSelectItem={onSelect}
        setValue={setValue}
        style={styles.dropdownStyle}
        labelStyle={styles.labelStyle}
        listItemLabelStyle={styles.listItemLabelStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        selectedItemLabelStyle={styles.selectedItemLabelStyle}
        selectedItemContainerStyle={styles.selectedItemContainerStyle}
        placeholderStyle={styles.placeholderStyle}
        renderListItem={renderListItem}
      />
    </View>
  );
};
