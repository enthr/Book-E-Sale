export class SubOrderModel {
	bookId!: number;
	quantity!: number;
	price!: number;
	totalPrice!: number;
}

export class OrderAddModel {
	userId!: number;
	orderDate?: string;
	subOrders!: SubOrderModel[];
	totalPrice!: number; 
}
