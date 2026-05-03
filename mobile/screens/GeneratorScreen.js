import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { aiAPI } from '../services/api';

const apiMap = {
  'product-generator': 'generateProduct',
  'seo-generator': 'generateSEO',
  'ads-generator': 'generateAds',
  'business-ideas': 'generateBusinessIdeas',
  'social-content': 'generateSocialContent',
  'competitor-analysis': 'generateCompetitorAnalysis',
};

export default function GeneratorScreen({ route }) {
  const { type, typeName } = route.params;
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const apiFunction = aiAPI[apiMap[type]];
      if (!apiFunction) {
        Alert.alert('Error', 'Generator not available');
        return;
      }

      const { data } = await apiFunction({ prompt });
      setResult(data.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Enter your prompt</Text>
        <TextInput
          style={styles.input}
          placeholder={`Describe what you want to generate...`}
          placeholderTextColor="#64748b"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Generated Content</Text>
          <ScrollView style={styles.resultContent}>
            <Text style={styles.resultText}>{result}</Text>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  inputSection: {
    padding: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 120,
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  resultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  resultContent: {
    maxHeight: 400,
  },
  resultText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 24,
  },
});
