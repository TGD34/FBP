import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { Game, PredictionResult, RecommendedBet } from '@/types/api';
import { TrendingUp } from 'lucide-react-native';

interface PredictionCardProps {
  game: Game;
  prediction: PredictionResult;
}

export default function PredictionCard({ game, prediction }: PredictionCardProps) {
  const { colors } = useTheme();
  
  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <TrendingUp size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Prediction Analysis</Text>
      </View>
      
      <View style={styles.probabilities}>
        <View style={styles.probabilityItem}>
          <Text style={[styles.teamName, { color: colors.text }]}>{game.home_team}</Text>
          <View style={[styles.probabilityBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.probabilityFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${prediction.homeWinProbability * 100}%` 
                }
              ]} 
            />
          </View>
          <Text style={[styles.probabilityText, { color: colors.primary }]}>
            {formatPercentage(prediction.homeWinProbability)}
          </Text>
        </View>
        
        <View style={styles.probabilityItem}>
          <Text style={[styles.teamName, { color: colors.text }]}>Draw</Text>
          <View style={[styles.probabilityBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.probabilityFill, 
                { 
                  backgroundColor: colors.secondary,
                  width: `${prediction.drawProbability * 100}%` 
                }
              ]} 
            />
          </View>
          <Text style={[styles.probabilityText, { color: colors.secondary }]}>
            {formatPercentage(prediction.drawProbability)}
          </Text>
        </View>
        
        <View style={styles.probabilityItem}>
          <Text style={[styles.teamName, { color: colors.text }]}>{game.away_team}</Text>
          <View style={[styles.probabilityBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.probabilityFill, 
                { 
                  backgroundColor: colors.accent,
                  width: `${prediction.awayWinProbability * 100}%` 
                }
              ]} 
            />
          </View>
          <Text style={[styles.probabilityText, { color: colors.accent }]}>
            {formatPercentage(prediction.awayWinProbability)}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
        Recommended Bets
      </Text>
      
      <View style={styles.recommendationsContainer}>
        {prediction.recommendedBets.map((bet, index) => (
          <RecommendedBetItem key={index} bet={bet} />
        ))}
      </View>
    </View>
  );
}

interface RecommendedBetItemProps {
  bet: RecommendedBet;
}

function RecommendedBetItem({ bet }: RecommendedBetItemProps) {
  const { colors } = useTheme();
  
  // Determine confidence color
  let confidenceColor = colors.muted;
  if (bet.confidence > 70) {
    confidenceColor = colors.success;
  } else if (bet.confidence > 50) {
    confidenceColor = colors.warning;
  }
  
  return (
    <View style={[styles.betContainer, { borderColor: colors.border }]}>
      <View style={styles.betHeader}>
        <Text style={[styles.betMarket, { color: colors.primary }]}>{bet.market}</Text>
        <View style={[styles.confidenceContainer, { backgroundColor: confidenceColor }]}>
          <Text style={styles.confidenceText}>{Math.round(bet.confidence)}% confidence</Text>
        </View>
      </View>
      
      <Text style={[styles.betSelection, { color: colors.text }]}>{bet.selection}</Text>
      
      <View style={styles.betFooter}>
        <Text style={[styles.betOddsLabel, { color: colors.muted }]}>Odds:</Text>
        <Text style={[styles.betOdds, { color: colors.text }]}>{bet.odds.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  probabilities: {
    marginBottom: 20,
  },
  probabilityItem: {
    marginBottom: 12,
  },
  teamName: {
    fontSize: 14,
    marginBottom: 4,
  },
  probabilityBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  probabilityFill: {
    height: '100%',
    borderRadius: 4,
  },
  probabilityText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recommendationsContainer: {
    gap: 12,
  },
  betContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  betMarket: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  betSelection: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  betFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  betOddsLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  betOdds: {
    fontSize: 16,
    fontWeight: '700',
  },
});