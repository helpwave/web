export type ProductPlan = 'monthly' | 'yearly' | 'once';

export type Product = {
  uuid: string,
  name: string,
  price: number,
  plan: ProductPlan,
}
