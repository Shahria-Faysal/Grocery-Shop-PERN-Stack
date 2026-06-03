import { Prisma, OrderStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";


//create order
export const createOrder = async (req, res) => {
  try {
    const order = await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { user_id: req.user.id },
      });

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      const productIds = cartItems.map((i) => i.product_id);
      const cartMap = new Map(cartItems.map((i) => [i.product_id, i]));

      const products = await tx.$queryRaw`
        SELECT * FROM "Product"
        WHERE id IN (${Prisma.join(productIds)})
        FOR UPDATE
      `;

      for (const product of products) {
        const item = cartMap.get(product.id);
        if (product.stock < item.quantity) {
          throw new Error(`"${product.name}" is out of stock`);
        }
      }

      const total_price = products.reduce((sum, product) => {
        const item = cartMap.get(product.id);
        return sum + Number(product.price) * item.quantity;
      }, 0);

      await Promise.all(
        cartItems.map((item) =>
          tx.product.update({
            where: { id: item.product_id },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      const order = await tx.order.create({
        data: {
          user_id: req.user.id,
          total_price,
          payment: req.body.payment,
          // status: OrderStatus.pending,
          order_items: {
            create: products.map((product) => {
              const item = cartMap.get(product.id);
              return {
                product_id: product.id,
                quantity: item.quantity,
                price: Number(product.price),
              };
            }),
          },
        },
        include: { order_items: true },
      });

      await tx.cartItem.deleteMany({ where: { user_id: req.user.id } });

      return order;
    });

    res.status(201).json(order);
  } catch (err) {
    const status = err.message.includes("out of stock") ? 422 : 500;
    res.status(status).json({ error: err.message });
  }
};



// cancel order
export const cancelOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { order_items: true },
      });

      if (!order) {
        const err = new Error("Order not found");
        err.status = 404;
        throw err;
      }

      if (order.user_id !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
      }

      const cancellable = [OrderStatus.pending, OrderStatus.confirmed];
      if (!cancellable.includes(order.status)) {
        const err = new Error("Order cannot be cancelled at this stage");
        err.status = 400;
        throw err;
      }

      // restore stock for all items (batched with Promise.all)
      await Promise.all(
        order.order_items.map((item) =>
          tx.product.update({
            where: { id: item.product_id },
            data: { stock: { increment: item.quantity } },
          })
        )
      );

      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.cancelled },
      });
    });

    res.json(updated);
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message });
  }
};


// get all orders for admin only
export const getAllOrders = async (req, res) => {

  try {
    const orders = await prisma.order.findMany({
      include: { order_items: true },
    });
    res.json(orders);
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message });
  }
}

//get orders for user
export const getOrders = async (req, res) => {
  try {
    const id = Number(req.user.id);
    const order = await prisma.order.findMany({
      where: { user_id: id },
    });
    
    if (!order) {
      const err = new Error("Order not found");
      err.status = 404;
      throw err;
    }

    if (order.user_id !== req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    
    res.json(order);
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message });
  }
}



//get orders by Id
export const getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { order_items: true },
    });
    
    if (!order) {
      const err = new Error("Order not found");
      err.status = 404;
      throw err;
    }

    if (order.user_id !== req.user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }
    
    res.json(order);
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message });
  }
}