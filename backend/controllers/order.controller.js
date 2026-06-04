import { Prisma, OrderStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";


// price calulate
const USER_DISCOUNTS = {
  student: 10,
  vip: 25,
  regular: 0
};
const getFinalPrice = (product, userType) => {
  const basePrice = Number(product.price);

  // 1. product discount
  const productDiscount = Number(product.discount_percent || 0);
  let priceAfterProductDiscount =
    basePrice - (basePrice * productDiscount) / 100;

  // 2. user discount
  const userDiscount = USER_DISCOUNTS[userType] || 0;

  const finalPrice =
    priceAfterProductDiscount -
    (priceAfterProductDiscount * userDiscount) / 100;

  return finalPrice;
};


//create order
export const createOrder = async (req, res) => {
  try {
    const order = await prisma.$transaction(async (tx) => {
      const { product_ids } = req.body;

      if (!product_ids || product_ids.length === 0) {
        throw new Error("No items selected");
      }

      const cartItems = await tx.cartItem.findMany({
        where: {
          user_id: req.user.id,
          product_id: {
            in: product_ids
          }
        },
      });

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      if (cartItems.length !== product_ids.length) {
        throw new Error("Some items not found in cart");
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

      const userType = req.user.user_type || "regular";

      const total_price = products.reduce((sum, product) => {
        const item = cartMap.get(product.id);

        const finalPrice = getFinalPrice(product, userType);

        return sum + finalPrice * Number(item.quantity);
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
                price: getFinalPrice(product, userType)
              };
            }),
          },
        },
        include: { order_items: true },
      });

      await tx.cartItem.deleteMany({
        where: {
          user_id: req.user.id,
          product_id: {
            in: product_ids
          }
        }
      });

      // Audit Log within transaction
      await tx.auditLog.create({
        data: {
          action: "CREATE",
          table_name: "Order",
          record_id: order.id,
          new_data: order,
          user_id: req.user.id
        }
      });

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

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.cancelled },
      });

      // Audit Log within transaction
      await tx.auditLog.create({
        data: {
          action: "CANCEL_ORDER",
          table_name: "Order",
          record_id: orderId,
          old_data: { status: order.status },
          new_data: { status: OrderStatus.cancelled },
          user_id: req.user.id
        }
      });

      return updatedOrder;
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

// update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
      err.status = 400;
      throw err;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      const err = new Error("Order not found");
      err.status = 404;
      throw err;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        table_name: "Order",
        record_id: orderId,
        old_data: { status: order.status },
        new_data: { status },
        user_id: req.user.id
      }
    });

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder
    });
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message });
  }
};