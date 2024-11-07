export interface OrderItem {
    toy_id: number;
    quantity: number;
    price: number;
  }
  
 export interface Order {
    ID: number;
    user_id: number;
    status: string;
    total_cost: number;
    order_items: OrderItem[];
  }