import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { useApiKeyStore } from '@/store/api-key-store';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ExternalLink, Info, Key } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

export default function ApiKeyScreen() {
  const { colors } = useTheme();
  const { apiKey, setApiKey, isAdmin } = useApiKeyStore();
  const [key, setKey] = useState(apiKey || '');
  
  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    if (!key.trim()) {
      Alert.alert(
        "Invalid API Key",
        "Please enter a valid API key."
      );
      return;
    }
    
    setApiKey(key.trim());
    router.back();
  };
  
  const handleUseDemoMode = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setApiKey('demo');
    router.back();
  };
  
  const openApiWebsite = async () => {
    await WebBrowser.openBrowserAsync('https://the-odds-api.com/');
  };
  
  console.log('API Key screen - isAdmin:', isAdmin, 'apiKey:', apiKey ? 'exists' : 'none');
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Enter your API Key</Text>
      
      <Text style={[styles.description, { color: colors.muted }]}>
        To use this app, you need an API key from the-odds-api.com. 
        Enter your key below to access betting odds and predictions.
      </Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            }
          ]}
          placeholder="Enter API key"
          placeholderTextColor={colors.muted}
          value={key}
          onChangeText={setKey}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Save API Key</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.demoButton, { backgroundColor: colors.secondary }]}
        onPress={handleUseDemoMode}
      >
        <Text style={styles.buttonText}>Use Demo Mode</Text>
      </TouchableOpacity>
      
      <View style={[styles.demoInfoContainer, { backgroundColor: 'rgba(67, 97, 238, 0.1)', borderColor: colors.primary }]}>
        <Info size={20} color={colors.primary} />
        <Text style={[styles.demoInfoText, { color: colors.text }]}>
          Demo mode uses mock data to showcase app functionality without requiring an API key.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.linkContainer}
        onPress={openApiWebsite}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Get an API key from the-odds-api.com
        </Text>
        <ExternalLink size={16} color={colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>How to get an API key:</Text>
        <Text style={[styles.infoText, { color: colors.muted }]}>
          1. Visit the-odds-api.com{"\n"}
          2. Sign up for a free account{"\n"}
          3. Navigate to your dashboard{"\n"}
          4. Copy your API key{"\n"}
          5. Paste it here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  demoButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfoContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  demoInfoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  linkText: {
    fontSize: 16,
    marginRight: 6,
  },
  infoContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});