import { reconcilePendingReservations } from "../utils/reconciliation.job.js";

setInterval(() => {
  reconcilePendingReservations().catch((err) => console.error("Reconciliation error:", err));
}, 60 * 1000); 