import FoodCheckout from '@/components/orders/FoodCheckout';
import { requireUserPage } from '@/lib/auth';

export default async function CheckoutPage() {
  await requireUserPage('/checkout');
  return <main className="min-h-screen bg-slate-50 px-5 pb-16 pt-32 dark:bg-slate-950"><div className="mx-auto max-w-3xl"><FoodCheckout /></div></main>;
}
