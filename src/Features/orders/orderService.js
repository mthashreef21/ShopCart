const ORDERS_KEY = "shopcart_orders";

// Delivery simulation timings in milliseconds
const DELIVERY_STAGES = [
  { status: "Order Placed", time: 0 },
  { status: "Order Confirmed", time: 60_000 },
  { status: "Shipped", time: 120_000 },
  { status: "Out for Delivery", time: 180_000 },
  { status: "Delivered", time: 300_000 },
];

/**
 * Retrieve all saved orders.
 */
function readOrders() {
  try {
    const savedOrders = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]"
    );

    return Array.isArray(savedOrders) ? savedOrders : [];
  } catch (error) {
    console.error("Failed to read orders:", error);
    return [];
  }
}

/**
 * Save orders to localStorage.
 */
function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/**
 * Calculate the correct delivery stage from the order time.
 */
export function getCurrentOrderStatus(order) {
  if (!order) {
    return "Order Placed";
  }

  // Preserve cancellation if you add cancellation functionality later.
  if (order.status === "Cancelled") {
    return "Cancelled";
  }

  const placedAt = new Date(order.placedAt).getTime();

  if (!Number.isFinite(placedAt)) {
    return order.status || "Order Placed";
  }

  const elapsedTime = Date.now() - placedAt;

  let currentStage = DELIVERY_STAGES[0].status;

  for (const stage of DELIVERY_STAGES) {
    if (elapsedTime >= stage.time) {
      currentStage = stage.status;
    }
  }

  return currentStage;
}

/**
 * Synchronize an order's stored status with its elapsed time.
 */
function synchronizeOrderStatus(order) {
  const currentStatus = getCurrentOrderStatus(order);

  if (currentStatus === order.status) {
    return order;
  }

  return {
    ...order,
    status: currentStatus,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get orders belonging to the logged-in user.
 */
export function getUserOrders(userId) {
  if (!userId) {
    return [];
  }

  const orders = readOrders();

  const updatedOrders = orders.map((order) => {
    if (order.userId !== userId) {
      return order;
    }

    return synchronizeOrderStatus(order);
  });

  saveOrders(updatedOrders);

  return updatedOrders
    .filter((order) => order.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.placedAt).getTime() -
        new Date(a.placedAt).getTime()
    );
}

/**
 * Get a specific order belonging to a user.
 */
export function getOrderById(orderId, userId) {
  if (!orderId || !userId) {
    return null;
  }

  const orders = readOrders();

  const index = orders.findIndex(
    (order) =>
      String(order.id) === String(orderId) &&
      order.userId === userId
  );

  if (index === -1) {
    return null;
  }

  const updatedOrder = synchronizeOrderStatus(orders[index]);

  if (updatedOrder !== orders[index]) {
    orders[index] = updatedOrder;
    saveOrders(orders);
  }

  return updatedOrder;
}

/**
 * Save a new order.
 */
export function createOrder(orderData) {
  if (!orderData?.userId) {
    throw new Error(
      "A logged-in user is required to place an order."
    );
  }

  if (
    !Array.isArray(orderData.items) ||
    orderData.items.length === 0
  ) {
    throw new Error(
      "Your order must contain at least one product."
    );
  }

  const orders = readOrders();

  const order = {
    ...orderData,
    id:
      orderData.id ||
      `SC-${Date.now().toString(36).toUpperCase()}`,
    placedAt: orderData.placedAt || new Date().toISOString(),
    status: "Order Placed",
  };

  saveOrders([order, ...orders]);

  return order;
}

/**
 * Manually update an order's status.
 */
export function updateOrderStatus(orderId, userId, status) {
  if (!orderId || !userId || !status) {
    throw new Error(
      "Order ID, user ID and status are required."
    );
  }

  const orders = readOrders();

  const index = orders.findIndex(
    (order) =>
      String(order.id) === String(orderId) &&
      order.userId === userId
  );

  if (index === -1) {
    throw new Error("Order not found.");
  }

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  saveOrders(orders);

  return orders[index];
}