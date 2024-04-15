import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChainId, useNetwork, useSwitchNetwork } from 'wagmi';

import { Icon } from '../icon/icon.component';
import { useTheme } from '../../hook/theme.hook';
import { AppTheme } from '../../theme/theme';
import { Chain } from 'viem';
import { chainImages } from '../../const/chain-image.const';

interface RenderItemProps {
  item: Chain;
}

export const SwitchChainDrodown = () => {
  const chainId = useChainId();
  const { chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [isOpen, setIsOpen] = useState(false);
  const [chain, setChain] = useState(chains.find((chain) => chainId === chain.id) ?? chains[0]);

  const theme = useTheme();
  const styles = initStyles(theme);

  useEffect(() => {
    if (!chainId) return;

    setChain(chains.find((chain) => chainId === chain.id) ?? chains[0]);
  }, [chainId]);

  const toggleModalVisible = () => setIsOpen(!isOpen);

  const onSwitchChange = async (item: Chain) => {
    if (chain.id === item.id) return toggleModalVisible();

    switchNetwork?.(item.id);
    toggleModalVisible();
  };

  const renderItem = useCallback(
    ({ item }: RenderItemProps) => {
      return (
        <TouchableOpacity style={styles.modalItemContainer} onPress={() => onSwitchChange(item)}>
          <Image src={chainImages[item.id]} style={styles.image} resizeMode="cover" />
          <Text style={styles.modalItemText}>{item.name}</Text>
        </TouchableOpacity>
      );
    },
    [onSwitchChange]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModalVisible} style={styles.dropdown}>
        <Image src={chainImages[chain.id]} style={styles.image} resizeMode="cover" />
        <Text style={styles.text} ellipsizeMode="tail" numberOfLines={1}>
          {chain.name}
        </Text>
        {isOpen ? <Icon name="chevron-up" disable /> : <Icon name="chevron-down" disable />}
        {isOpen ? (
          <View style={styles.modalView}>
            <FlatList data={chains} renderItem={renderItem} style={styles.flatList} />
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    </View>
  );
};

const initStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.radiusCircle,
      borderColor: theme.primaryColor,
      borderWidth: 1,
      paddingHorizontal: theme.spaceS,
      // paddingVertical: theme.spaceS,
      justifyContent: 'space-between',
      maxWidth: '50%',
      backgroundColor: theme.primaryColor,
    },
    container: {
      //flex: 1,
      marginVertical: theme.spaceMS,
      marginHorizontal: theme.spaceS,
      zIndex: 10,
    },
    text: {
      color: theme.textContrastColor,
      marginRight: theme.spaceS,
      flexShrink: 1,
      flex: 1,
    },
    modalView: {
      position: 'absolute',
      backgroundColor: theme.neutralColor200,
      borderRadius: theme.radiusMS,
      margin: theme.spaceML,
      paddingHorizontal: theme.spaceS,
      paddingVertical: theme.spaceM,
      alignItems: 'center',
      top: 24,
      left: -18,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalItemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      paddingVertical: theme.spaceS,
      paddingHorizontal: theme.spaceMS,
    },
    modalItemText: {
      fontWeight: '600',
      color: theme.textColor,
    },
    title: {
      color: theme.textColor,
      fontWeight: '700',
      marginBottom: theme.spaceM,
    },
    flatList: {
      width: '100%',
    },
    image: {
      width: theme.spaceXXL,
      height: theme.spaceXXL,
      borderRadius: theme.radiusCircle,
      marginRight: theme.spaceXS,
    },
  });
};
