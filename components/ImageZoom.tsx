import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, Dimensions, StyleSheet, Text, ImageSourcePropType, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ImageZoomProps {
  source: ImageSourcePropType | { uri: string };
  style?: any;
  alt?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export function ImageZoom({ source, style, alt, resizeMode = 'cover' }: ImageZoomProps) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    touchableImage: {
      ...(Platform.OS === 'web' && { cursor: 'pointer' }),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    modalImage: {
      width: Dimensions.get('window').width * 0.95,
      height: Dimensions.get('window').height * 0.85,
    },
    closeButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    altText: {
      position: 'absolute',
      bottom: 50,
      left: 20,
      right: 20,
      textAlign: 'center',
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: '#FFFFFF',
      ...(Platform.OS === 'web' ? {
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
      } : {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
      }),
      paddingHorizontal: theme.spacing.md,
    },
  });

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.touchableImage}>
        <Image source={source} style={style} resizeMode={resizeMode} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={1}>
              <Image 
                source={source} 
                style={styles.modalImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            {alt && (
              <Text style={styles.altText}>{alt}</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}