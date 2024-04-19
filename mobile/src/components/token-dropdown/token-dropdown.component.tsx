import React, { useCallback, useState } from 'react';
import { useTheme } from '../../hook/theme.hook';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TokenData } from '../../const/token.const';
import { AppTheme } from '../../theme/theme';
import { Icon } from '../icon/icon.component';

interface TokenDropdownProps {
  tokenList: TokenData[];
  value?: TokenData;
  onValueChange: (token: TokenData) => void;
}

interface RenderItemProps {
  item: TokenData;
}

export const TokenDropdown = ({ tokenList, value, onValueChange }: TokenDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const styles = initStyles(theme);

  const toggleModalVisible = () => setIsOpen(!isOpen);

  const onPressItem = (token: TokenData) => {
    onValueChange(token);
    toggleModalVisible();
  };

  const renderDropdown = useCallback(
    (token?: TokenData) => {
      if (!token) {
        return (
          <>
            <Text style={styles.text}>Chọn một token</Text>
            {isOpen ? (
              <Icon name="chevron-up" style={styles.icon} disable />
            ) : (
              <Icon name="chevron-down" style={styles.icon} disable />
            )}
          </>
        );
      }

      return (
        <View style={styles.flexRow}>
          <Image source={{ uri: token.image }} style={styles.image} resizeMode="cover" />
          <Text style={styles.text}>{token.name}</Text>
          {isOpen ? (
            <Icon name="chevron-up" style={styles.icon} disable />
          ) : (
            <Icon name="chevron-down" style={styles.icon} disable />
          )}
        </View>
      );
    },
    [isOpen]
  );

  const renderItem = useCallback(
    ({ item }: RenderItemProps) => {
      return (
        <TouchableOpacity style={styles.modalItemContainer} onPress={() => onPressItem(item)}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          <Text style={styles.modalItemText}>{item.name}</Text>
        </TouchableOpacity>
      );
    },
    [onPressItem]
  );

  return (
    <View>
      <TouchableOpacity onPress={toggleModalVisible} style={styles.wrapper}>
        {renderDropdown(value)}
      </TouchableOpacity>
      {isOpen ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isOpen}
          onRequestClose={toggleModalVisible}
        >
          <TouchableOpacity onPress={toggleModalVisible} style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalView}>
                <Text style={styles.title}>Chọn 1 token</Text>
                <FlatList data={tokenList} renderItem={renderItem} style={styles.flatList} />
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      ) : (
        <></>
      )}
    </View>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    wrapper: {
      padding: theme.spaceMS,
      borderRadius: theme.radiusCircle,
      backgroundColor: theme.primaryColor,
      flexDirection: 'row',
      alignItems: 'center',
    },
    flexRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    text: {
      color: theme.textContrastColor,
    },
    icon: {
      ...theme.icon,
      marginLeft: theme.spaceXS,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      width: '70%',
      backgroundColor: theme.backgroundColor,
      borderRadius: theme.radiusMS,
      margin: theme.spaceML,
      paddingHorizontal: theme.spaceL,
      paddingVertical: theme.spaceM,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalItemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingVertical: theme.spaceS,
      paddingHorizontal: theme.spaceS,
    },
    modalItemText: {
      fontWeight: '600',
      color: theme.textColor,
      fontSize: theme.fontL,
    },
    title: {
      color: theme.textColor,
      fontWeight: '700',
      marginBottom: theme.spaceM,
    },
    flatList: {
      width: '100%',
      maxHeight: '70%',
    },
    image: {
      width: theme.spaceLL,
      height: theme.spaceLL,
      borderRadius: theme.radiusCircle,
      overflow: 'hidden',
      marginRight: theme.spaceS,
    },
  });
};
