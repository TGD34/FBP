import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { useApiKeyStore } from '@/store/api-key-store';
import { Trash2, Plus, Image as ImageIcon, Edit2, Check, X, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Image as ExpoImage } from 'expo-image';
import { useTeamLogos } from '@/context/team-logo-context';

// Admin API key - in a real app, this would be handled more securely
const ADMIN_API_KEY = 'FBPTOOLADMIN2137';

export default function TeamLogosScreen() {
  const { colors } = useTheme();
  const { apiKey, isAdmin: apiKeyIsAdmin } = useApiKeyStore();
  const { 
    logos, 
    isLoading, 
    error, 
    refreshLogos,
    addLogo,
    updateLogo,
    deleteLogo,
    isAdmin: logoContextIsAdmin
  } = useTeamLogos();
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Check if user has admin access
  const hasAdminAccess = logoContextIsAdmin || apiKeyIsAdmin || apiKey === ADMIN_API_KEY;
  
  const handleAddLogo = async () => {
    if (!newTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    
    if (!newLogoUrl.trim()) {
      Alert.alert('Error', 'Please enter a logo URL');
      return;
    }
    
    if (!newLogoUrl.startsWith('http')) {
      Alert.alert('Error', 'Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      await addLogo(newTeamName.trim(), newLogoUrl.trim());
      
      setNewTeamName('');
      setNewLogoUrl('');
      
      Alert.alert('Success', `Logo for ${newTeamName} added successfully`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add logo');
    }
  };
  
  const handleRemoveLogo = async (teamName: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Remove Logo',
      `Are you sure you want to remove the logo for ${teamName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await deleteLogo(teamName);
              Alert.alert('Success', `Logo for ${teamName} removed successfully`);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove logo');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleEditLogo = (teamName: string, logoUrl: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    setEditingTeam(teamName);
    setEditTeamName(teamName);
    setEditLogoUrl(logoUrl);
  };
  
  const handleCancelEdit = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    setEditingTeam(null);
    setEditTeamName('');
    setEditLogoUrl('');
  };
  
  const handleSaveEdit = async (oldTeamName: string) => {
    if (!editTeamName.trim()) {
      Alert.alert('Error', 'Please enter a team name');
      return;
    }
    
    if (!editLogoUrl.trim()) {
      Alert.alert('Error', 'Please enter a logo URL');
      return;
    }
    
    if (!editLogoUrl.startsWith('http')) {
      Alert.alert('Error', 'Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      await updateLogo(oldTeamName, editTeamName.trim(), editLogoUrl.trim());
      
      setEditingTeam(null);
      setEditTeamName('');
      setEditLogoUrl('');
      
      Alert.alert('Success', `Logo for ${editTeamName} updated successfully`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update logo');
    }
  };
  
  const handleRefresh = async () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    setRefreshing(true);
    try {
      await refreshLogos();
      Alert.alert('Success', 'Team logos refreshed successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to refresh logos');
    } finally {
      setRefreshing(false);
    }
  };
  
  if (!hasAdminAccess) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.accessDenied}>
          <Text style={[styles.accessDeniedTitle, { color: colors.text }]}>
            Admin Access Required
          </Text>
          <Text style={[styles.accessDeniedText, { color: colors.muted }]}>
            You need admin privileges to manage team logos. Please use the admin API key in the API Key settings.
          </Text>
          <View style={[styles.adminKeyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.adminKeyLabel, { color: colors.muted }]}>Admin Key:</Text>
            <Text style={[styles.adminKeyText, { color: colors.primary }]}>
              FBPTOOLADMIN2137
            </Text>
          </View>
        </View>
      </View>
    );
  }
  
  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading team logos...</Text>
      </View>
    );
  }
  
  if (error && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {error.message || 'Failed to load team logos'}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={handleRefresh}
        >
          <RefreshCw size={20} color="white" style={styles.retryIcon} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <View style={[styles.adminBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.adminBadgeText}>Admin Mode</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: colors.secondary }]}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <RefreshCw size={16} color="white" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={[styles.notionInfo, { backgroundColor: 'rgba(67, 97, 238, 0.1)', borderColor: colors.primary }]}>
        <Text style={[styles.notionInfoText, { color: colors.text }]}>
          Team logos are fetched from SheetDB and stored locally for offline access.
        </Text>
      </View>
      
      <View style={[styles.addForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.formTitle, { color: colors.text }]}>Add New Team Logo</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Team Name</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }
            ]}
            placeholder="Enter team name"
            placeholderTextColor={colors.muted}
            value={newTeamName}
            onChangeText={setNewTeamName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Logo URL</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }
            ]}
            placeholder="Enter logo URL"
            placeholderTextColor={colors.muted}
            value={newLogoUrl}
            onChangeText={setNewLogoUrl}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddLogo}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Plus size={20} color="white" />
              <Text style={styles.addButtonText}>Add Logo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Team Logos ({logos.length})
      </Text>
      
      <FlatList
        data={logos}
        keyExtractor={(item) => item.id || item.teamName}
        renderItem={({ item }) => (
          <View style={[styles.logoItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {editingTeam === item.teamName ? (
              // Edit mode
              <View style={styles.editContainer}>
                <View style={styles.editInputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Team Name</Text>
                  <TextInput
                    style={[
                      styles.editInput,
                      { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="Enter team name"
                    placeholderTextColor={colors.muted}
                    value={editTeamName}
                    onChangeText={setEditTeamName}
                  />
                </View>
                
                <View style={styles.editInputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Logo URL</Text>
                  <TextInput
                    style={[
                      styles.editInput,
                      { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }
                    ]}
                    placeholder="Enter logo URL"
                    placeholderTextColor={colors.muted}
                    value={editLogoUrl}
                    onChangeText={setEditLogoUrl}
                  />
                </View>
                
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: colors.danger }]}
                    onPress={handleCancelEdit}
                  >
                    <X size={20} color="white" />
                    <Text style={styles.editButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: colors.success }]}
                    onPress={() => handleSaveEdit(item.teamName)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Check size={20} color="white" />
                        <Text style={styles.editButtonText}>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // View mode
              <>
                <View style={styles.logoInfo}>
                  {item.logoUrl ? (
                    <ExpoImage
                      source={{ uri: item.logoUrl }}
                      style={styles.logoImage}
                      contentFit="contain"
                    />
                  ) : (
                    <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]}>
                      <ImageIcon size={24} color={colors.muted} />
                    </View>
                  )}
                  <View style={styles.logoDetails}>
                    <Text style={[styles.teamName, { color: colors.text }]}>{item.teamName}</Text>
                    <Text 
                      style={[styles.logoUrl, { color: colors.muted }]}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {item.logoUrl}
                    </Text>
                    <Text style={[styles.createdAt, { color: colors.muted }]}>
                      Added: {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.logoActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleEditLogo(item.teamName, item.logoUrl)}
                    disabled={isLoading}
                  >
                    <Edit2 size={20} color="white" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.danger }]}
                    onPress={() => handleRemoveLogo(item.teamName)}
                    disabled={isLoading}
                  >
                    <Trash2 size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No team logos added yet. Add your first logo above.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  adminBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  notionInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  notionInfoText: {
    fontSize: 14,
  },
  addForm: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  logoItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  logoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  logoUrl: {
    fontSize: 12,
    marginBottom: 4,
  },
  createdAt: {
    fontSize: 12,
  },
  logoActions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  accessDeniedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  accessDeniedText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  adminKeyContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    alignItems: 'center',
  },
  adminKeyLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  adminKeyText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editContainer: {
    width: '100%',
  },
  editInputContainer: {
    marginBottom: 12,
  },
  editInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});