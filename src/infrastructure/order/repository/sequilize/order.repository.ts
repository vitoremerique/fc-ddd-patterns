import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItem from "../../../../domain/checkout/entity/order_item";
export default class OrderRepository implements OrderRepositoryInterface {
  
  
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }


 async update(entity: Order): Promise<void> {
    await OrderModel.update({
      id:entity.id,
      customer_id:entity.customerId,
      total: entity.total()
    },{where:{id:entity.id},
  }
);

    for (const item of entity.items){
      await OrderItemModel.update({
        name:item.name,
        price:item.price,
        quantity:item.quantity,
        porduct_id:item.productId
      },{where:{id:item.id, order_id:entity.id},
    }
  );
    }

  }



 
  async find(id: string): Promise<Order> {
    let orderResult;
    try{
      orderResult = await OrderModel.findOne({where:{id:id}, include:[{model:OrderItemModel,as:"items"}]})
    }
    catch{
      throw new Error("Order not found")
    }

    const orderFound = orderResult.items.map((item)=>{
      return new OrderItem(item.id,item.name,item.price,item.product_id,item.quantity)
    })

    const result = new Order(orderResult.id,orderResult.customer_id, orderFound)

    return result

  }
  async findAll(): Promise<Order[]> {
    
    
    
    let orderResult;
    try{
      orderResult = await OrderModel.findAll({include:[{model:OrderItemModel,as:"items"}]})
    }
    catch{
      throw new Error("Order not found")
    }
    const result = orderResult.map((order)=>{

      const itemsResult = order.items.map((item)=>{
        return new OrderItem(item.id,item.name,item.price,item.product_id,item.quantity)
      })

      return new Order(order.id,order.customer_id, itemsResult)

    })

    return result
  }



  
}
