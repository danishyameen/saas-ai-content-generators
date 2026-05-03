import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { paymentsAPI } from '../services/api';

export default function BillingScreen() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const { data } = await paymentsAPI.getPricing();
      setPricing(data.data);
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWebCheckout = async (plan) => {
    try {
      // In production, call the API to get checkout URL
      // For now, open the web pricing page
      Linking.openURL('https://your-saas.com/pricing');
    } catch (error) {
      console.error('Failed to open checkout:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upgrade Your Plan</Text>
        <Text style={styles.subtitle}>Get unlimited access to all AI generators</Text>
      </View>

      {pricing?.plans?.map((plan, index) => (
        <View key={index} style={[styles.planCard, plan.popular && styles.popularPlan]}>
          {plan.popular && <Text style={styles.popularBadge}>MOST POPULAR</Text>}
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${plan.price}</Text>
              <Text style={styles.period}>/{plan.period}</Text>
            </View>
          </View>

          <View style={styles.featuresList}>
            {plan.features.map((feature, i) => (
              <View key={i} style={styles.featureItem}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.planButton, plan.popular && styles.popularButton]}
            onPress={() => openWebCheckout(plan.name.toLowerCase())}
          >
            <Text style={styles.planButtonText}>{plan.cta}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          All plans include a 7-day free trial. Cancel anytime.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },
  header: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
  },
  planCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  popularPlan: {
    borderColor: '#0ea5e9',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#0ea5e9',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  period: {
    color: '#64748b',
    fontSize: 16,
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureCheck: {
    color: '#10b981',
    fontSize: 16,
    marginRight: 8,
  },
  featureText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  planButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#0ea5e9',
  },
  planButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
});
