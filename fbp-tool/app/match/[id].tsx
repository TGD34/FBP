import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useTheme } from '@/context/theme-context';
import { useApiKeyStore } from '@/store/api-key-store';
import { fetchOdds, generatePrediction } from '@/services/api';
import { Game, PredictionResult } from '@/types/api';
import { format } from 'date-fns';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { useFavoritesStore } from '@/store/favorites-store';
import MarketOdds from '@/components/MarketOdds';
import PredictionCard from '@/components/PredictionCard';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { mockMatches } from '@/mocks/matches';
import { useLeagueStore } from '@/store/league-store';
import { Image as ExpoImage } from 'expo-image';
import { useTeamLogos } from '@/context/team-logo-context';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { apiKey } = useApiKeyStore();
  const { selectedLeague } = useLeagueStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { getLogo } = useTeamLogos();
  
  const [match, setMatch] = useState<Game | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const favorite = isFavorite(id);
  
  useEffect(() => {
    const loadMatch = async () => {
      if (!apiKey) {
        setError("API key not found");
        setLoading(false);
        return;
      }
      
      try {
        // If we're in demo mode, use mock data directly
        if (apiKey === 'demo') {
          const foundMatch = mockMatches.find(m => m.id === id);
          if (foundMatch) {
            setMatch(foundMatch);
            setPrediction(generatePrediction(foundMatch));
          } else {
            setError("Match not found");
          }
          setLoading(false);
          return;
        }
        
        const response = await fetchOdds(apiKey, selectedLeague);
        
        if (response.success) {
          const foundMatch = response.data.find(m => m.id === id);
          if (foundMatch) {
            setMatch(foundMatch);
            setPrediction(generatePrediction(foundMatch));
          } else {
            setError("Match not found");
          }
        } else {
          setError("Failed to load match data");
        }
      } catch (err) {
        setError("An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadMatch();
  }, [id, apiKey, selectedLeague]);
  
  const toggleFavorite = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (error || !match) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error || "Match not found"}
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const matchDate = new Date(match.commence_time);
  const formattedDate = format(matchDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(matchDate, 'h:mm a');
  
  // Get team logos
  const homeLogo = getLogo(match.home_team);
  const awayLogo = getLogo(match.away_team);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: `${match.home_team} vs ${match.away_team}`,
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleFavorite}
              style={styles.favoriteButton}
            >
              <Heart 
                size={24} 
                color={favorite ? colors.accent : colors.text} 
                fill={favorite ? colors.accent : 'transparent'} 
              />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.matchHeader}>
          <View style={styles.leagueContainer}>
            <Text style={[styles.leagueText, { color: colors.primary }]}>
              {match.sport_title}
            </Text>
            {apiKey === 'demo' && (
              <View style={[styles.demoModeContainer, { backgroundColor: colors.primary }]}>
                <Text style={styles.demoModeText}>Demo Mode</Text>
              </View>
            )}
          </View>
          <Text style={[styles.dateText, { color: colors.text }]}>
            {formattedDate} • {formattedTime}
          </Text>
        </View>
        
        <View style={[styles.teamsContainer, { borderColor: colors.border }]}>
          <View style={styles.teamContainer}>
            {homeLogo ? (
              <ExpoImage
                source={{ uri: homeLogo }}
                style={styles.teamLogo}
                contentFit="contain"
              />
            ) : (
              <View style={[styles.teamLogoPlaceholder, { backgroundColor: colors.border }]}>
                <Text style={[styles.teamLogoInitial, { color: colors.text }]}>
                  {match.home_team.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={[styles.teamName, { color: colors.text }]}>{match.home_team}</Text>
            <Text style={[styles.homeLabel, { color: colors.muted }]}>Home</Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { color: colors.muted }]}>vs</Text>
          </View>
          
          <View style={styles.teamContainer}>
            {awayLogo ? (
              <ExpoImage
                source={{ uri: awayLogo }}
                style={styles.teamLogo}
                contentFit="contain"
              />
            ) : (
              <View style={[styles.teamLogoPlaceholder, { backgroundColor: colors.border }]}>
                <Text style={[styles.teamLogoInitial, { color: colors.text }]}>
                  {match.away_team.charAt(0)}
                </Text>
              </View>
            )}
            <Text style={[styles.teamName, { color: colors.text }]}>{match.away_team}</Text>
            <Text style={[styles.awayLabel, { color: colors.muted }]}>Away</Text>
          </View>
        </View>
        
        {prediction && (
          <PredictionCard game={match} prediction={prediction} />
        )}
        
        <View style={styles.oddsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Markets</Text>
          
          <MarketOdds 
            title="Match Winner" 
            bookmakers={match.bookmakers} 
            marketKey="h2h" 
          />
          
          <MarketOdds 
            title="Handicap" 
            bookmakers={match.bookmakers} 
            marketKey="spreads" 
          />
          
          <MarketOdds 
            title="Over/Under" 
            bookmakers={match.bookmakers} 
            marketKey="totals" 
          />
        </View>
        
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, { color: colors.muted }]}>
            {apiKey === 'demo' 
              ? 'Using demo data for illustration purposes only.' 
              : `Odds provided by the-odds-api.com. Last updated: ${format(new Date(), 'MMM d, yyyy h:mm a')}`
            }
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  matchHeader: {
    padding: 16,
  },
  leagueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  leagueText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
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
  dateText: {
    fontSize: 18,
    fontWeight: '700',
  },
  teamsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  teamContainer: {
    flex: 2,
    alignItems: 'center',
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  teamLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamLogoInitial: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  homeLabel: {
    fontSize: 14,
  },
  awayLabel: {
    fontSize: 14,
  },
  vsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: 18,
    fontWeight: '600',
  },
  oddsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  disclaimer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});