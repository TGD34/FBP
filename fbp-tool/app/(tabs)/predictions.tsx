import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { useApiKeyStore } from '@/store/api-key-store';
import { useLeagueStore } from '@/store/league-store';
import { useRefreshStore } from '@/store/refresh-store';
import { fetchOdds, generatePrediction } from '@/services/api';
import { Game, PredictionResult } from '@/types/api';
import EmptyState from '@/components/EmptyState';
import { Key, TrendingUp } from 'lucide-react-native';
import PredictionCard from '@/components/PredictionCard';
import LeagueSelector from '@/components/LeagueSelector';
import { format } from 'date-fns';

export default function PredictionsScreen() {
  const { colors } = useTheme();
  const { apiKey, hasApiKey } = useApiKeyStore();
  const { selectedLeague, getLeagueTitle } = useLeagueStore();
  const { needsRefresh, lastUpdated } = useRefreshStore();
  const [matches, setMatches] = useState<Game[]>([]);
  const [predictions, setPredictions] = useState<Map<string, PredictionResult>>(new Map());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        
        // Generate predictions for each match
        const newPredictions = new Map<string, PredictionResult>();
        response.data.forEach(match => {
          newPredictions.set(match.id, generatePrediction(match));
        });
        setPredictions(newPredictions);
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
  }, [apiKey, selectedLeague]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadMatches(true); // Force refresh
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
        message="Please set up your API key in the settings to start viewing odds and predictions."
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
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const prediction = predictions.get(item.id);
          if (!prediction) return null;
          return <PredictionCard game={item} prediction={prediction} />;
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
                Match Predictions
              </Text>
              {apiKey === 'demo' && (
                <View style={[styles.demoModeContainer, { backgroundColor: colors.primary }]}>
                  <Text style={styles.demoModeText}>Demo Mode</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.subHeaderText, { color: colors.muted }]}>
              AI-powered betting recommendations
            </Text>
            
            <View style={styles.leagueSelectorContainer}>
              <LeagueSelector />
            </View>
            
            {matches.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.muted }]}>
                  No matches available for {getLeagueTitle()} to predict.
                </Text>
              </View>
            ) : (
              <View style={styles.matchInfoContainer}>
                <Text style={[styles.matchCount, { color: colors.muted }]}>
                  {matches.length} matches available
                </Text>
                <Text style={[styles.lastUpdated, { color: colors.muted }]}>
                  {getLastUpdatedText()}
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && matches.length === 0 ? (
            <EmptyState
              title="No Predictions Available"
              message={`There are no matches to predict for ${getLeagueTitle()} at the moment. Please try another league or check back later.`}
              icon={<TrendingUp size={50} color={colors.muted} />}
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
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  matchInfoContainer: {
    marginTop: 8,
  },
  matchCount: {
    fontSize: 14,
  },
  lastUpdated: {
    fontSize: 12,
    marginTop: 4,
  },
});