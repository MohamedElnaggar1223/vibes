import { TicketType } from '@/lib/types/ticketTypes';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  ticketInfo: {
    fontSize: 12,
  },
});

type Props = {
    ticketData: TicketType
}

const TicketPdf = ({ ticketData }: Props) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Text>Ticket Information:</Text>
        <View style={styles.ticketInfo}>
          <Text>Event Name: {ticketData.eventId}</Text>
          <Text>User: {ticketData.userId}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPdf;
