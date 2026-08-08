import ReceiptView from '@/components/receipts/ReceiptView';
import { requireUserPage } from '@/lib/auth';

export default async function ReceiptPage({ params }) {
  const { receiptNumber } = await params;
  await requireUserPage(`/my-receipts/${encodeURIComponent(receiptNumber)}`);
  return <main className="min-h-screen bg-slate-100 px-5 pb-16 pt-32"><div className="mx-auto max-w-5xl"><ReceiptView receiptNumber={receiptNumber} /></div></main>;
}
