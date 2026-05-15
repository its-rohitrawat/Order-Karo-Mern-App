import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { TbReceipt2 } from "react-icons/tb";
import { toast } from "sonner";
import { ORDER_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";

const STATUS_STYLES = {
  pending: "bg-stone-100 text-stone-600",
  preparing: "bg-amber-50 text-amber-700",
  "out of delivery": "bg-sky-50 text-sky-700",
  delivered: "bg-green-50 text-green-700",
};

function formatOrderId(id) {
  return `#OK${String(id).slice(-6).toUpperCase()}`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function paymentLabel(method, paid) {
  if (method === "cod") return "Cash on Delivery";
  return paid ? "Paid online" : "Online (pending)";
}

function MetaRow({ label, value, valueClass = "text-stone-800" }) {
  return (
    <div className="flex justify-between items-center mb-3 last:mb-0 gap-3">
      <span className="text-xs text-stone-500 font-medium uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className={`text-sm font-semibold text-right ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

function ShopOrderBlock({ shopOrder, role }) {
  const shopName = shopOrder.shop?.name || "Restaurant";
  const status = shopOrder.status || "pending";

  return (
    <div className="mt-3 pt-3 border-t border-stone-200">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-stone-800">{shopName}</p>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 ${
            STATUS_STYLES[status] || STATUS_STYLES.pending
          }`}
        >
          {status}
        </span>
      </div>
      <ul className="space-y-1.5 mb-2">
        {shopOrder.shopOrderItems?.map((line, i) => (
          <li
            key={i}
            className="flex justify-between text-xs text-stone-600 gap-2"
          >
            <span className="truncate">
              {line.name} × {line.quantity}
            </span>
            <span className="font-medium text-stone-800 shrink-0">
              ₹{line.price * line.quantity}
            </span>
          </li>
        ))}
      </ul>
      {role === "owner" && shopOrder.subtotal != null && (
        <p className="text-xs text-stone-500 text-right">
          Subtotal:{" "}
          <span className="font-semibold text-stone-800">
            ₹{shopOrder.subtotal}
          </span>
        </p>
      )}
    </div>
  );
}

function OrderCard({ order, role }) {
  const paid = order.payment === true;
  const paymentText = paymentLabel(order.paymentMethod, paid);
  const paymentClass =
    order.paymentMethod === "cod"
      ? "text-stone-700"
      : paid
        ? "text-green-600"
        : "text-amber-600";

  const allDelivered = order.shopOrders?.every(
    (s) => s.status === "delivered",
  );

  return (
    <article className="bg-stone-50 border border-stone-200 rounded-2xl p-5 shadow-sm text-left">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400 mb-0.5">
            Order placed
          </p>
          <p className="text-lg font-bold text-stone-900">
            {formatOrderId(order._id)}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {formatDate(order.createdAt)}
          </p>
        </div>
        {allDelivered && (
          <FaCheckCircle className="text-orange-500 text-xl shrink-0 mt-1" />
        )}
      </div>

      <MetaRow label="Order ID" value={formatOrderId(order._id)} />
      <MetaRow
        label="Total"
        value={`₹${order.totalAmount}`}
        valueClass="text-orange-600"
      />
      <MetaRow
        label="Payment"
        value={
          order.paymentMethod === "cod"
            ? paymentText
            : `${paymentText}${paid ? " ✅" : ""}`
        }
        valueClass={paymentClass}
      />
      {role === "user" && order.deliveryAddress?.text && (
        <MetaRow
          label="Delivery"
          value={order.deliveryAddress.text}
          valueClass="text-stone-700 max-w-[55%] truncate"
        />
      )}
      {role === "owner" && order.user && (
        <MetaRow
          label="Customer"
          value={order.user.fullName || order.user.email}
        />
      )}

      {order.shopOrders?.map((shopOrder, i) => (
        <ShopOrderBlock key={i} shopOrder={shopOrder} role={role} />
      ))}
    </article>
  );
}

function MyOrdersPanel({ open, onClose, role }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(ORDER_ROUTES.GET_ORDERS);
        setOrders(data.orders || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Could not load your orders",
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [open]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[10001] bg-stone-900/40 backdrop-blur-[2px]"
        aria-label="Close orders"
        onClick={onClose}
      />

      <aside
        className="fixed top-0 right-0 z-[10002] h-full w-full max-w-md bg-white shadow-2xl shadow-stone-900/10 flex flex-col border-l border-stone-100"
        role="dialog"
        aria-label="My orders"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-stone-100 bg-linear-to-r from-amber-50 via-white to-orange-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <TbReceipt2 className="text-orange-500" size={20} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400">
                {role === "owner" ? "Restaurant" : "Your"}
              </p>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                My Orders
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 bg-linear-to-b from-stone-50/80 to-amber-50/20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
              <p className="text-sm text-stone-500">Loading orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 flex flex-col items-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <TbReceipt2 className="text-orange-500 w-7 h-7" />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400 mb-1">
                No orders yet
              </p>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Nothing to show
              </h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                {role === "owner"
                  ? "Orders from customers will appear here."
                  : "Place your first order and it will show up here."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} role={role} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default MyOrdersPanel;
