export type DigitalProduct = {
    title: string,
    price: number,
    currency: 'EGP' | 'USD' | 'SAR' | 'AED',
    itemCategory: 'Vehicles',
    itemDescription: string,
    itemName: string,
    role: 'Seller' | 'Buyer' | 'Broker (Transaction Confidential)' | 'Broker (Transaction Transparent for Buyer and  Seller)'
    inspectionPeriod: string
    notes?: string,
    status: 'onSale' | 'sold' | 'cancelled' | 'pending' | 'inEscrow',
    userId: string,
    id: string
}