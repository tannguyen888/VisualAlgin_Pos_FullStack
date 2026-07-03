import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, backgroundColor: '#FFFFFF' },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 12 },
  section: { marginBottom: 10 },
  line: { fontSize: 11, marginBottom: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#D4D4D8', marginVertical: 8 },
});

const fmt = (v) => Number(v).toLocaleString('vi-VN') + ' VND';
const fmtNum = (v) => Number(v).toLocaleString('vi-VN');

export default async function myDocument(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) return;

  const grandTotal = rows.reduce((sum, item) => sum + (item.totalRevenue ?? 0), 0);
  const grandSold = rows.reduce((sum, item) => sum + (item.totalSold ?? 0), 0);
  const date = new Date().toLocaleDateString('en-GB');

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Today Sale Report</Text>

        <View style={styles.section}>
          {rows.map((item) => (
            <Text key={item.id} style={styles.line}>
              {item.name} ({item.sku}) | Sold: {fmtNum(item.totalSold)} | Revenue: {fmt(item.totalRevenue)}
            </Text>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.line}>Grand Total Sold: {fmtNum(grandSold)}</Text>
          <Text style={styles.line}>Grand Total Revenue: {fmt(grandTotal)}</Text>
          <Text style={styles.line}>Date: {date}</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `sales-report-${Date.now()}.pdf`;
  a.click();

  URL.revokeObjectURL(url);
}