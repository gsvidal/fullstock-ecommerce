ALTER TABLE "orders" ADD COLUMN "mercadopago_order_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_mercadopago_order_id_key" UNIQUE("mercadopago_order_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_status_check" CHECK ("status" IN ('pending', 'paid'));