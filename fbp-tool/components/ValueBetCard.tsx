import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { Game, ValueBet } from '@/types/api';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface ValueBetCardProps {
  valueBet: ValueBet;
  match: Game;
}

export default function ValueBetCard({ valueBet, match }: ValueBetCardProps) {
  const { colors } = useTheme();
  
  const handlePress = () => {
    router.push(`/match/${match.id}`);
  };
  
  const matchDate = new Date(match.commence_time);
  const formattedDate = format(matchDate, 'MMM d');
  const formattedTime = format(matchDate, 'h:mm a');
  
  // Determine color based on value percentage
  let valueColor = colors.success;
  if (valueBet.valuePercentage < 10) {
    valueColor = colors.primary;
  } else if (valueBet.valuePercentage >= 20) {
    valueColor = colors.accent;
  }
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.matchInfo}>
          <Text style={[styles.teams, { color: colors.text }]}>
            {match.home_team} vs {match.away_team}
          </Text>
          <Text style={[styles.dateTime, { color: colors.muted }]}>
            {formattedDate} • {formattedTime}
          </Text>
        </View>
        <View style={[styles.valueContainer, { backgroundColor: valueColor }]}>
          <Text style={styles.valueText}>+{valueBet.valuePercentage.toFixed(1)}%</Text>
        </View>
      </View>
      
      <View style={styles.betDetails}>
        <View style={styles.betInfo}>
          <Text style={[styles.marketTitle, { color: colors.primary }]}>{valueBet.market}</Text>
          <Text style={[styles.selection, { color: colors.text }]}>{valueBet.selection}</Text>
        </View>
        
        <View style={styles.oddsContainer}>
          <View style={styles.oddsColumn}>
            <Text style={[styles.oddsLabel, { color: colors.muted }]}>Bookmaker Odds</Text>
            <Text style={[styles.oddsValue, { color: colors.text }]}>{valueBet.bookmakerOdds.toFixed(2)}</Text>
          </View>
          
          <View style={styles.oddsColumn}>
            <Text style={[styles.oddsLabel, { color: colors.muted }]}>Fair Odds</Text>
            <Text style={[styles.oddsValue, { color: colors.text }]}>{valueBet.fairOdds.toFixed(2)}</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.bookmakerInfo}>
          <Text style={[styles.bookmakerLabel, { color: colors.muted }]}>Available at:</Text>
          <Text style={[styles.bookmakerName, { color: colors.text }]}>{valueBet.bookmakerName}</Text>
        </View>
        
        <View style={styles.viewDetails}>
          <Text style={[styles.viewDetailsText, { color: colors.primary }]}>View Match</Text>
          <ArrowRight size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  matchInfo: {
    flex: 1,
  },
  teams: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 12,
  },
  valueContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  valueText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  betDetails: {
    padding: 12,
  },
  betInfo: {
    marginBottom: 12,
  },
  marketTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  selection: {
    fontSize: 18,
    fontWeight: '700',
  },
  oddsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oddsColumn: {
    flex: 1,
  },
  oddsLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  oddsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  bookmakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmakerLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  bookmakerName: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});