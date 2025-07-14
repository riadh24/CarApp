import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/UseThemeHooks';

const { height } = Dimensions.get('window');

/**
 * Reusable Modal Component
 * Single Responsibility: Provide consistent modal wrapper
 * Open/Closed: Extensible through children and props
 */
const BaseModal = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  position = 'bottom',
  style,
  overlayStyle,
  showCloseButton = true,
  maxHeight = '70%',
  ...props
}) => {
  const { theme } = useTheme();

  const getModalStyle = () => {
    const baseStyle = [
      styles.modalContent,
      { backgroundColor: theme.colors.background },
      style
    ];

    switch (position) {
      case 'center':
        return [
          ...baseStyle,
          styles.centerModal,
          { maxHeight: height * 0.8 }
        ];
      case 'top':
        return [
          ...baseStyle,
          styles.topModal,
          { maxHeight }
        ];
      case 'bottom':
      default:
        return [
          ...baseStyle,
          styles.bottomModal,
          { maxHeight }
        ];
    }
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={true}
      onRequestClose={onClose}
      {...props}
    >
      <View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={getModalStyle()}>
          {showCloseButton && position !== 'center' && (
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          )}
          
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    borderRadius: 20,
    paddingTop: 20,
  },
  bottomModal: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  topModal: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
  },
  centerModal: {
    margin: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
});

export default BaseModal;
