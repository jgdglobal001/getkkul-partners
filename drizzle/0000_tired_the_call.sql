CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"recipientName" text NOT NULL,
	"phone" text NOT NULL,
	"zipCode" text NOT NULL,
	"address" text NOT NULL,
	"detailAddress" text,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_registrations" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"businessType" text NOT NULL,
	"businessName" text NOT NULL,
	"businessNumber" text NOT NULL,
	"representativeName" text NOT NULL,
	"businessCategory" text NOT NULL,
	"businessType2" text NOT NULL,
	"businessAddress" text NOT NULL,
	"contactName" text NOT NULL,
	"contactPhone" text NOT NULL,
	"contactEmail" text NOT NULL,
	"bankName" text NOT NULL,
	"accountNumber" text NOT NULL,
	"accountHolder" text NOT NULL,
	"platformUrl" text,
	"mobileAppUrl" text,
	"businessRegistrationDoc" text,
	"bankbookDoc" text,
	"step" integer DEFAULT 1 NOT NULL,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"sellerId" text,
	"tossStatus" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_registrations_userId_unique" UNIQUE("userId"),
	CONSTRAINT "business_registrations_businessNumber_unique" UNIQUE("businessNumber")
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"productId" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image" text,
	"parentId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"productId" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" real NOT NULL,
	"discountPercentage" real DEFAULT 0 NOT NULL,
	"finalPrice" real NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"orderNumber" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"totalAmount" real NOT NULL,
	"shippingCost" real DEFAULT 0 NOT NULL,
	"discountAmount" real DEFAULT 0 NOT NULL,
	"finalAmount" real NOT NULL,
	"recipientName" text NOT NULL,
	"recipientPhone" text NOT NULL,
	"shippingAddress" text NOT NULL,
	"shippingDetailAddress" text,
	"shippingZipCode" text NOT NULL,
	"deliveryRequest" text,
	"partnerId" text,
	"partnerSellerId" text,
	"partnerLinkId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_orderNumber_unique" UNIQUE("orderNumber")
);
--> statement-breakpoint
CREATE TABLE "partner_links" (
	"id" text PRIMARY KEY NOT NULL,
	"shortCode" text NOT NULL,
	"partnerId" text NOT NULL,
	"productId" text NOT NULL,
	"clickCount" integer DEFAULT 0 NOT NULL,
	"conversionCount" integer DEFAULT 0 NOT NULL,
	"revenue" real DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_links_shortCode_unique" UNIQUE("shortCode")
);
--> statement-breakpoint
CREATE TABLE "product_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"questionId" text NOT NULL,
	"answer" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"userId" text NOT NULL,
	"question" text NOT NULL,
	"isSecret" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"discountPercentage" real DEFAULT 0 NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"brand" text,
	"category" text NOT NULL,
	"thumbnail" text NOT NULL,
	"images" text[] NOT NULL,
	"detailImages" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"sku" text NOT NULL,
	"weight" real,
	"dimensions" json,
	"warrantyInformation" text,
	"shippingInformation" text,
	"returnPolicy" text,
	"minimumOrderQuantity" integer DEFAULT 1 NOT NULL,
	"availabilityStatus" text DEFAULT 'In Stock' NOT NULL,
	"meta" json,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"asResponsible" text,
	"autoLimitations" text,
	"bundleShipping" text,
	"clothingLimitations" text,
	"color" text,
	"detailedSpecs" text,
	"electronicsLimitations" text,
	"exchangeReturnCost" text,
	"exchangeReturnDeadline" text,
	"exchangeReturnLimitations" text,
	"foodLimitations" text,
	"kcCertification" text,
	"madeInCountry" text,
	"manufacturer" text,
	"material" text,
	"mediaLimitations" text,
	"modelNumber" text,
	"productComposition" text,
	"productName" text,
	"releaseDate" text,
	"sellerLegalNotice" text,
	"sellerName" text,
	"sellerPhone" text,
	"shippingCost" text,
	"shippingMethod" text,
	"shippingPeriod" text,
	"size" text,
	"warrantyStandard" text,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"provider" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"firstName" text,
	"lastName" text,
	"phone" text,
	"newsletter" boolean DEFAULT false NOT NULL,
	"notifications" boolean DEFAULT true NOT NULL,
	"emailVerified" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"productId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_registrations" ADD CONSTRAINT "business_registrations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_partnerId_users_id_fk" FOREIGN KEY ("partnerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_links" ADD CONSTRAINT "partner_links_partnerId_users_id_fk" FOREIGN KEY ("partnerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_links" ADD CONSTRAINT "partner_links_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_answers" ADD CONSTRAINT "product_answers_questionId_product_questions_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."product_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_questions" ADD CONSTRAINT "product_questions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_idx" ON "accounts" USING btree ("provider","providerAccountId");--> statement-breakpoint
CREATE INDEX "partner_links_shortCode_idx" ON "partner_links" USING btree ("shortCode");--> statement-breakpoint
CREATE INDEX "partner_links_partnerId_idx" ON "partner_links" USING btree ("partnerId");--> statement-breakpoint
CREATE INDEX "partner_links_productId_idx" ON "partner_links" USING btree ("productId");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_tokens_identifier_token_idx" ON "verification_tokens" USING btree ("identifier","token");