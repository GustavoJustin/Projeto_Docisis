import { View, Text, StyleSheet, ScrollView, FlatList, Image } from 'react-native';
import { colors } from '../theme/colors';

const productos = [
  { id: '1', name: 'Chocolate Belga 70%', cat: 'Matéria-prima', uso: '85 kg', estoque: '120 kg', status: 'ESTÁVEL', isCritical: false, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=120&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Creme de Leite Fresco', cat: 'Laticínios', uso: '42 L', estoque: '05 L', status: 'CRÍTICO', isCritical: true, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=120&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Açúcar de Confeiteiro', cat: 'Secos', uso: '120 kg', estoque: '300 kg', status: 'ESTÁVEL', isCritical: false, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=120&auto=format&fit=crop&q=80' },
];

export default function RelatoriosScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Relatórios e Analytics</Text>
          <Text style={styles.subtitle}>Visão detalhada do seu desempenho e estoque</Text>
        </View>
      </View>

      {/* Cards de Resumo */}
      <View style={styles.cardGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>VALOR EM ESTOQUE</Text>
          <Text style={styles.cardValue}>R$ 42.850,00</Text>
          <Text style={styles.cardGrowth}>↗ +12.5% vs mês anterior</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>BAIXO ESTOQUE</Text>
          <Text style={styles.cardValueAlert}>15</Text>
          <Text style={styles.cardAlertText}>⚠️ Ação imediata necessária</Text>
        </View>
      </View>

      {/* Tabela Mapeada via FlatList */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Produtos Mais Utilizados</Text>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Image source={{ uri: item.image }} style={styles.prodImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.prodName}>{item.name}</Text>
                <Text style={styles.prodCat}>{item.cat} • Uso: {item.uso}</Text>
              </View>
              <View style={[styles.badge, item.isCritical ? styles.badgeCrit : styles.badgeOk]}>
                <Text style={[styles.badgeText, item.isCritical ? styles.badgeTextCrit : styles.badgeTextOk]}>
                  {item.status}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EE' },
  content: { padding: 16, gap: 16 },
  header: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: colors.cocoa[700] },
  subtitle: { fontSize: 13, color: colors.cocoa[400] },
  cardGrid: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EAE6DF' },
  cardLabel: { fontSize: 10, fontWeight: '700', color: '#A8A29E' },
  cardValue: { fontSize: 20, fontWeight: '600', color: '#2C1F16', marginVertical: 4 },
  cardValueAlert: { fontSize: 20, fontWeight: '600', color: colors.red[600], marginVertical: 4 },
  cardGrowth: { fontSize: 11, color: colors.emerald[600], fontWeight: '500' },
  cardAlertText: { fontSize: 11, color: colors.red[600], fontWeight: '500' },
  tableContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EAE6DF' },
  tableTitle: { fontSize: 16, fontWeight: '700', color: '#292524', marginBottom: 12 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F0EC', gap: 12 },
  prodImg: { width: 40, height: 40, borderRadius: 8 },
  prodName: { fontSize: 14, fontWeight: '600', color: '#1C1917' },
  prodCat: { fontSize: 12, color: '#78716C' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeOk: { backgroundColor: colors.emerald[100] },
  badgeCrit: { backgroundColor: colors.red[100] },
  badgeText: { fontSize: 10, fontWeight: '700' },
  badgeTextOk: { color: colors.emerald[700] },
  badgeTextCrit: { color: colors.red[600] },
});