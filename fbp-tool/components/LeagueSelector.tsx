import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { useLeagueStore } from '@/store/league-store';
import { soccerLeagues } from '@/mocks/leagues';
import { ChevronDown, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function LeagueSelector() {
  const { colors } = useTheme();
  const { selectedLeague, setSelectedLeague } = useLeagueStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedLeagueData = soccerLeagues.find(league => league.key === selectedLeague);
  
  const handleSelectLeague = (leagueKey: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedLeague(leagueKey);
    setModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.leagueIcon]}>{selectedLeagueData?.icon}</Text>
        <Text style={[styles.leagueText, { color: colors.text }]}>
          {selectedLeagueData?.title || 'Select League'}
        </Text>
        <ChevronDown size={18} color={colors.muted} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select League</Text>
              <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={soccerLeagues}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.leagueItem, 
                    { borderBottomColor: colors.border },
                    selectedLeague === item.key && { backgroundColor: 'rgba(67, 97, 238, 0.1)' }
                  ]}
                  onPress={() => handleSelectLeague(item.key)}
                >
                  <View style={styles.leagueItemContent}>
                    <Text style={styles.leagueIcon}>{item.icon}</Text>
                    <View>
                      <Text style={[styles.leagueItemTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.leagueItemSubtitle, { color: colors.muted }]}>{item.country}</Text>
                    </View>
                  </View>
                  
                  {selectedLeague === item.key && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  leagueIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  leagueText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  leagueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  leagueItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  leagueItemSubtitle: {
    fontSize: 14,
  },
});