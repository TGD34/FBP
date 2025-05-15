import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/theme-context';
import { Bookmaker, Market, Outcome } from '@/types/api';

interface MarketOddsProps {
  title: string;
  bookmakers: Bookmaker[];
  marketKey: string;
}

export default function MarketOdds({ title, bookmakers, marketKey }: MarketOddsProps) {
  const { colors } = useTheme();
  
  // Find all bookmakers that offer this market
  const relevantBookmakers = bookmakers.filter(
    bookmaker => bookmaker.markets.some(market => market.key === marketKey)
  );
  
  if (relevantBookmakers.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {relevantBookmakers.map((bookmaker) => {
          const market = bookmaker.markets.find(m => m.key === marketKey);
          if (!market) return null;
          
          return (
            <View 
              key={bookmaker.key}
              style={[styles.bookmakerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.bookmakerName, { color: colors.primary }]}>{bookmaker.title}</Text>
              <View style={styles.outcomesContainer}>
                {market.outcomes.map((outcome) => (
                  <OutcomeItem 
                    key={`${outcome.name}-${outcome.point || ''}`}
                    outcome={outcome} 
                    marketKey={marketKey}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

interface OutcomeItemProps {
  outcome: Outcome;
  marketKey: string;
}

function OutcomeItem({ outcome, marketKey }: OutcomeItemProps) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.outcomeContainer}>
      <View style={styles.outcomeNameContainer}>
        <Text style={[styles.outcomeName, { color: colors.text }]}>
          {outcome.name}
          {outcome.point !== undefined && ` ${outcome.point > 0 ? '+' : ''}${outcome.point}`}
        </Text>
      </View>
      <View style={[styles.priceContainer, { backgroundColor: colors.primary }]}>
        <Text style={styles.price}>{outcome.price.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  bookmakerCard: {
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 180,
  },
  bookmakerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  outcomesContainer: {
    gap: 8,
  },
  outcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outcomeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  outcomeName: {
    fontSize: 14,
  },
  priceContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  price: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});