import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

export function LanguageSelector() {
  const { theme } = useTheme();
  const { changeLanguage, currentLanguage } = useI18n();
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = (code: string) => {
    changeLanguage(code);
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.xs,
    },
    buttonText: {
      fontSize: 14,
      fontFamily: theme.fonts.bodySemiBold,
      color: theme.colors.text,
    },
    flagText: {
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      margin: theme.spacing.lg,
      minWidth: 280,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.headingSemiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.xs,
    },
    selectedOption: {
      backgroundColor: theme.colors.primaryLight + '20',
    },
    modalFlagText: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    languageName: {
      fontSize: 16,
      fontFamily: theme.fonts.body,
      color: theme.colors.text,
      flex: 1,
    },
  });

  // Use i18n.language instead of currentLanguage to ensure reactivity
  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.flagText}>{currentLang.flag}</Text>
        <Text style={styles.buttonText}>{currentLang.code.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <Text style={styles.modalTitle}>{t('common.language')}</Text>
            {languages.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  i18n.language === language.code && styles.selectedOption,
                ]}
                onPress={() => handleLanguageChange(language.code)}
              >
                <Text style={styles.modalFlagText}>{language.flag}</Text>
                <Text style={styles.languageName}>{language.name}</Text>
                {i18n.language === language.code && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}