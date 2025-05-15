import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { Game } from '@/types/api';
import { format } from 'date-fns';
import { Heart } from 'lucide-react-native';
import { useFavoritesStore } from '@/store/favorites-store';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { useTeamLogos } from '@/context/team-logo-context';

interface MatchCardProps {
  match: Game;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { colors } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { getLogo } = useTeamLogos();
  const favorite = isFavorite(match.id);
  
  const matchDate = new Date(match.commence_time);
  const formattedDate = format(matchDate, 'MMM d, yyyy');
  const formattedTime = format(matchDate, 'h:mm a');
  
  const handlePress = () => {
    router.push(`/match/${match.id}`);
  };
  
  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(match.id);
    } else {
      addFavorite(match.id);
    }
  };
  
  // Get team logos
  const homeLogo = getLogo(match.home_team);
  const awayLogo = getLogo(match.away_team);
  
  // Get odds for home and away teams
  const h2hMarket = match.bookmakers[0]?.markets.find(m => m.key === 'h2h');
  const homeOdds = h2hMarket?.outcomes.find(o => o.name === match.home_team)?.price.toFixed(2);
  const awayOdds = h2hMarket?.outcomes.find(o => o.name === match.away_team)?.price.toFixed(2);
  const drawOdds = h2hMarket?.outcomes.find(o => o.name === 'Draw')?.price.toFixed(2);
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[colors.card, Platform.OS === 'web' ? colors.card : 'rgba(67, 97, 238, 0.1)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.leagueContainer}>
            <Text style={[styles.league, { color: colors.primary }]}>{match.sport_title}</Text>
          </View>
          <Text style={[styles.date, { color: colors.muted }]}>{formattedDate} • {formattedTime}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={toggleFavorite}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Heart 
              size={20} 
              color={favorite ? colors.accent : colors.muted} 
              fill={favorite ? colors.accent : 'transparent'} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.teamsContainer}>
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
            <View style={styles.teamNameContainer}>
              <Text style={[styles.teamName, { color: colors.text }]}>{match.home_team}</Text>
            </View>
            {homeOdds && (
              <View style={[styles.oddsContainer, { backgroundColor: colors.primary }]}>
                <Text style={styles.odds}>{homeOdds}</Text>
              </View>
            )}
          </View>
          
          {drawOdds && (
            <View style={styles.drawContainer}>
              <Text style={[styles.vsText, { color: colors.muted }]}>vs</Text>
              <View style={[styles.oddsContainer, { backgroundColor: colors.secondary }]}>
                <Text style={styles.odds}>{drawOdds}</Text>
              </View>
              <Text style={[styles.drawText, { color: colors.muted }]}>Draw</Text>
            </View>
          )}
          
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
            <View style={styles.teamNameContainer}>
              <Text style={[styles.teamName, { color: colors.text }]}>{match.away_team}</Text>
            </View>
            {awayOdds && (
              <View style={[styles.oddsContainer, { backgroundColor: colors.primary }]}>
                <Text style={styles.odds}>{awayOdds}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.bookmakers, { color: colors.muted }]}>
            {match.bookmakers.length} bookmakers available
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  leagueContainer: {
    marginRight: 8,
  },
  league: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamContainer: {
    flex: 2,
    alignItems: 'center',
  },
  teamNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  teamLogoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamLogoInitial: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawContainer: {
    flex: 1,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 14,
    marginBottom: 8,
  },
  drawText: {
    fontSize: 12,
    marginTop: 4,
  },
  oddsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  odds: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bookmakers: {
    fontSize: 12,
  },
});