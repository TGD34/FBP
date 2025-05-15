import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { useApiKeyStore } from '@/store/api-key-store';
import { useLeagueStore } from '@/store/league-store';
import { useRefreshStore } from '@/store/refresh-store';
import { fetchOdds, generatePrediction } from '@/services/api';
import { Game, PredictionResult, ValueBet } from '@/types/api';
import EmptyState from '@/components/EmptyState';
import { Key, TrendingUp, DollarSign } from 'lucide-react-native';
import ValueBetCard from '@/components/ValueBetCard';
import LeagueSelector from '@/components/LeagueSelector';
import { findValueBets } from '@/utils/betting-utils';
import { format } from 'date-fns';

export default function ValueBetsScreen() {
  const { colors } = useTheme();
  const { apiKey, hasApiKey } = useApiKeyStore();
  const { selectedLeague, getLeagueTitle } = useLeagueStore();
  const { needsRefresh, lastUpdated } = useRefreshStore();
  const [matches, setMatches] = useState<Game[]>([]);
  const [valueBets, setValueBets] = useState<ValueBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valueThreshold, setValueThreshold] = useState<number>(10); // 10% value threshold by default
  
  const loadMatches = async (forceRefresh = false) => {
    if (!apiKey) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const response = await fetchOdds(
        apiKey,
        selectedLeague,
        'h2h,spreads,totals',
        'us',
        'decimal',
        forceRefresh
      );
      
      if (response.success) {
        setMatches(response.data);
        
        // Generate predictions and find value bets
        const allValueBets: ValueBet[] = [];
        
        for (const match of response.data) {
          const prediction = generatePrediction(match);
          const matchValueBets = findValueBets(match, prediction, valueThreshold);
          allValueBets.push(...matchValueBets);
        }
        
        // Sort by value percentage (descending)
        allValueBets.sort((a, b) => b.valuePercentage - a.valuePercentage);
        setValueBets(allValueBets);
      } else {
        setError("Failed to load matches. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    // Check if we need to refresh data for this league
    const shouldRefresh = needsRefresh(selectedLeague);
    loadMatches(shouldRefresh);
  }, [apiKey, selectedLeague, valueThreshold]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadMatches(true); // Force refresh
  };
  
  const handleThresholdChange = (newThreshold: number) => {
    setValueThreshold(newThreshold);
  };
  
  // Format the last updated time
  const getLastUpdatedText = () => {
    const timestamp = lastUpdated[selectedLeague];
    if (!timestamp) return "Never updated";
    return `Last updated: ${format(new Date(timestamp), 'MMM d, yyyy h:mm a')}`;
  };
  
  if (!hasApiKey()) {
    return (
      <EmptyState
        title="API Key Required"
        message="Please set up your API key in the settings to start viewing value bets."
        icon={<Key size={50} color={colors.muted} />}
      />
    );
  }
  
  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (error) {
    return (
      <EmptyState
        title="Something went wrong"
        message={error}
      />
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={valueBets}
        keyExtractor={(item, index) => `${item.matchId}-${item.market}-${item.selection}-${index}`}
        renderItem={({ item }) => {
          const match = matches.find(m => m.id === item.matchId);
          if (!match) return null;
          return <ValueBetCard valueBet={item} match={match} />;
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.headerText, { color: colors.text }]}>
                Value Bets
              </Text>
              {apiKey === 'demo' && (
                <View style={[styles.demoModeContainer, { backgroundColor: colors.primary }]}>
                  <Text style={styles.demoModeText}>Demo Mode</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.subHeaderText, { color: colors.muted }]}>
              Bets with positive expected value
            </Text>
            
            <View style={styles.leagueSelectorContainer}>
              <LeagueSelector />
            </View>
            
            <View style={styles.thresholdContainer}>
              <Text style={[styles.thresholdLabel, { color: colors.text }]}>Value Threshold:</Text>
              <View style={styles.thresholdButtons}>
                {[5, 10, 15, 20].map(threshold => (
                  <TouchableOpacity
                    key={threshold}
                    style={[
                      styles.thresholdButton,
                      { 
                        backgroundColor: valueThreshold === threshold ? colors.primary : colors.card,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => handleThresholdChange(threshold)}
                  >
                    <Text 
                      style={[
                        styles.thresholdButtonText, 
                        { color: valueThreshold === threshold ? 'white' : colors.text }
                      ]}
                    >
                      {threshold}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {matches.length > 0 && (
              <Text style={[styles.lastUpdated, { color: colors.muted }]}>
                {getLastUpdatedText()}
              </Text>
            )}
            
            {valueBets.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  No value bets found for {getLeagueTitle()} with {valueThreshold}% threshold.
                  Try lowering the threshold or selecting a different league.
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && valueBets.length === 0 ? (
            <EmptyState
              title="No Value Bets Found"
              message={`There are no value bets available for ${getLeagueTitle()} with the current threshold. Try adjusting your settings.`}
              icon={<DollarSign size={50} color={colors.muted} />}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 14,
    marginTop: 4,
  },
  demoModeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  demoModeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  leagueSelectorContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  thresholdContainer: {
    marginBottom: 8,
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  thresholdButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  thresholdButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  thresholdButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});