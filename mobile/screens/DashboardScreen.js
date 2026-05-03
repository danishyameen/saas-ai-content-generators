import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { authAPI } from '../services/api';

const generators = [
  { id: 'product', name: 'Product', icon: '📦', type: 'product-generator' },
  { id: 'seo', name: 'SEO', icon: '🔍', type: 'seo-generator' },
  { id: 'ads', name: 'Ads', icon: '📢', type: 'ads-generator' },
  { id: 'business', name: 'Business', icon: '💡', type: 'business-ideas' },
  { id: 'social', name: 'Social', icon: '📱', type: 'social-content' },
  { id: 'competitor', name: 'Competitor', icon: '📊', type: 'competitor-analysis' },
];

export default function DashboardScreen({ navigation, user, onLogout }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUserData(data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const openGenerator = (type) => {
    navigation.navigate('Generator', { type, typeName: generators.find(g => g.type === type)?.name });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.name}>{userData?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Plan Badge */}
      <View style={styles.planBadge}>
        <Text style={styles.planText}>{userData?.plan?.toUpperCase()} PLAN</Text>
        {userData?.plan === 'free' && (
          <Text style={styles.usageText}>
            {userData?.usageToday || 0}/5 requests today
          </Text>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userData?.totalAIRequests || 0}</Text>
          <Text style={styles.statLabel}>Total Requests</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userData?.referralCount || 0}</Text>
          <Text style={styles.statLabel}>Referrals</Text>
        </View>
      </View>

      {/* Generators */}
      <Text style={styles.sectionTitle}>AI Generators</Text>
      <View style={styles.generatorsGrid}>
        {generators.map((gen) => (
          <TouchableOpacity
            key={gen.id}
            style={styles.generatorCard}
            onPress={() => openGenerator(gen.type)}
          >
            <Text style={styles.generatorIcon}>{gen.icon}</Text>
            <Text style={styles.generatorName}>{gen.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Billing Button */}
      <TouchableOpacity
        style={styles.billingButton}
        onPress={() => navigation.navigate('Billing')}
      >
        <Text style={styles.billingText}>💳 Upgrade Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    color: '#64748b',
    fontSize: 16,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  planBadge: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usageText: {
    color: '#64748b',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  generatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    gap: 12,
  },
  generatorCard: {
    width: '30%',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  generatorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  generatorName: {
    color: '#fff',
    fontSize: 12,
  },
  billingButton: {
    margin: 20,
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  billingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
