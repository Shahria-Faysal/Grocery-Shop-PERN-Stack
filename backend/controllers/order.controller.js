import prisma from "../lib/prisma";


//create order
export const createOrder = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: Number(req.user.id) },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total_price = 0;

    for (const item of cartItems) {
      const price = item.product.price.toNumber();
      const discount = item.product.discount_percent.toNumber();

      const finalPrice = price - (price * discount / 100);
      total_price += finalPrice * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        user_id: Number(req.user.id),
        total_price,
        payment: req.body.payment,
        order_items: {
          create: cartItems.map(item => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
            price: item.product.price
          }))
        }
      }
    });

    await prisma.cartItem.deleteMany({
      where: { user_id: req.user.id }
    });

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};