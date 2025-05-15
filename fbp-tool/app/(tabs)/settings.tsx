import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, Platform } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { useApiKeyStore } from '@/store/api-key-store';
import { Key, Info, Trash2, ChevronRight, Image } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { apiKey, hasApiKey, clearApiKey, isAdmin } = useApiKeyStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  
  const handleToggleNotifications = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const handleClearApiKey = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "Remove API Key",
      "Are you sure you want to remove your API key? You will need to enter it again to use the app.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => {
            clearApiKey();
            Alert.alert("Success", "API key has been removed successfully.");
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const navigateToApiKey = () => {
    router.push('/settings/api-key');
  };
  
  const navigateToTeamLogos = () => {
    router.push('/settings/team-logos');
  };
  
  console.log('Settings screen - isAdmin:', isAdmin, 'apiKey:', apiKey ? 'exists' : 'none');
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>API Configuration</Text>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.settingRow} onPress={navigateToApiKey}>
            <View style={styles.settingIconContainer}>
              <Key size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>API Key</Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                {apiKey === 'demo' 
                  ? "Using demo mode" 
                  : hasApiKey() 
                    ? "API key is set" 
                    : "Set your API key to use the app"
                }
              </Text>
            </View>
            <ChevronRight size={20} color={colors.muted} />
          </TouchableOpacity>
          
          {hasApiKey() && (
            <TouchableOpacity 
              style={[styles.settingRow, styles.borderTop, { borderColor: colors.border }]}
              onPress={handleClearApiKey}
            >
              <View style={styles.settingIconContainer}>
                <Trash2 size={20} color={colors.danger} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.danger }]}>Remove API Key</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        {apiKey === 'demo' && (
          <View style={[styles.demoInfoContainer, { backgroundColor: 'rgba(67, 97, 238, 0.1)', borderColor: colors.primary }]}>
            <Info size={20} color={colors.primary} />
            <Text style={[styles.demoInfoText, { color: colors.text }]}>
              You're currently using demo mode with mock data. To access real-time odds, get an API key from the-odds-api.com.
            </Text>
          </View>
        )}
      </View>
      
      {isAdmin && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Admin Tools</Text>
          
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.settingRow} onPress={navigateToTeamLogos}>
              <View style={styles.settingIconContainer}>
                <Image size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Team Logo Management</Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Add or remove team logos
                </Text>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.adminInfoContainer, { backgroundColor: 'rgba(247, 37, 133, 0.1)', borderColor: colors.accent }]}>
            <Info size={20} color={colors.accent} />
            <Text style={[styles.adminInfoText, { color: colors.text }]}>
              Admin mode is active. You have access to additional features.
            </Text>
          </View>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Info size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.settingDescription, { color: colors.muted }]}>
                Receive alerts for new odds and predictions
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : notificationsEnabled ? colors.accent : '#f4f3f4'}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Version</Text>
            </View>
            <Text style={[styles.versionText, { color: colors.muted }]}>1.0.0</Text>
          </View>
          
          <View style={[styles.settingRow, styles.borderTop, { borderColor: colors.border }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>API Provider</Text>
            </View>
            <Text style={[styles.versionText, { color: colors.muted }]}>the-odds-api.com</Text>
          </View>
          
          <View style={[styles.settingRow, styles.borderTop, { borderColor: colors.border }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Supported Leagues</Text>
            </View>
            <Text style={[styles.versionText, { color: colors.muted }]}>14 Football Leagues</Text>
          </View>
        </View>
        
        <Text style={[styles.disclaimer, { color: colors.muted }]}>
          This app is for informational purposes only. Please gamble responsibly.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  borderTop: {
    borderTopWidth: 1,
  },
  versionText: {
    fontSize: 14,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  demoInfoContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  demoInfoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  adminInfoContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  adminInfoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});