import { pgTable, text, timestamp, boolean, integer, real, json, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users 테이블
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'),
  image: text('image'),
  role: text('role').notNull().default('user'),
  provider: text('provider'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
  firstName: text('firstName'),
  lastName: text('lastName'),
  phone: text('phone'),
  newsletter: boolean('newsletter').notNull().default(false),
  notifications: boolean('notifications').notNull().default(true),
  emailVerified: timestamp('emailVerified'),
});

// Accounts 테이블 (NextAuth)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  providerProviderAccountIdIdx: uniqueIndex('accounts_provider_providerAccountId_idx').on(table.provider, table.providerAccountId),
}));

// Sessions 테이블 (NextAuth)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

// Verification Tokens 테이블 (NextAuth)
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
}, (table) => ({
  identifierTokenIdx: uniqueIndex('verification_tokens_identifier_token_idx').on(table.identifier, table.token),
}));

// Products 테이블
export const products = pgTable('products', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: real('price').notNull(),
  discountPercentage: real('discountPercentage').notNull().default(0),
  rating: real('rating').notNull().default(0),
  stock: integer('stock').notNull().default(0),
  brand: text('brand'),
  category: text('category').notNull(),
  thumbnail: text('thumbnail').notNull(),
  images: text('images').array().notNull(),
  detailImages: text('detailImages').array().notNull(),
  tags: text('tags').array().notNull(),
  sku: text('sku').notNull().unique(),
  weight: real('weight'),
  dimensions: json('dimensions'),
  warrantyInformation: text('warrantyInformation'),
  shippingInformation: text('shippingInformation'),
  returnPolicy: text('returnPolicy'),
  minimumOrderQuantity: integer('minimumOrderQuantity').notNull().default(1),
  availabilityStatus: text('availabilityStatus').notNull().default('In Stock'),
  meta: json('meta'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
  // 추가 필드들
  asResponsible: text('asResponsible'),
  autoLimitations: text('autoLimitations'),
  bundleShipping: text('bundleShipping'),
  clothingLimitations: text('clothingLimitations'),
  color: text('color'),
  detailedSpecs: text('detailedSpecs'),
  electronicsLimitations: text('electronicsLimitations'),
  exchangeReturnCost: text('exchangeReturnCost'),
  exchangeReturnDeadline: text('exchangeReturnDeadline'),
  exchangeReturnLimitations: text('exchangeReturnLimitations'),
  foodLimitations: text('foodLimitations'),
  kcCertification: text('kcCertification'),
  madeInCountry: text('madeInCountry'),
  manufacturer: text('manufacturer'),
  material: text('material'),
  mediaLimitations: text('mediaLimitations'),
  modelNumber: text('modelNumber'),
  productComposition: text('productComposition'),
  productName: text('productName'),
  releaseDate: text('releaseDate'),
  sellerLegalNotice: text('sellerLegalNotice'),
  sellerName: text('sellerName'),
  sellerPhone: text('sellerPhone'),
  shippingCost: text('shippingCost'),
  shippingMethod: text('shippingMethod'),
  shippingPeriod: text('shippingPeriod'),
  size: text('size'),
  warrantyStandard: text('warrantyStandard'),
});

// Partner Links 테이블
export const partnerLinks = pgTable('partner_links', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  shortCode: text('shortCode').notNull().unique(),
  partnerId: text('partnerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  clickCount: integer('clickCount').notNull().default(0),
  conversionCount: integer('conversionCount').notNull().default(0),
  revenue: real('revenue').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  shortCodeIdx: index('partner_links_shortCode_idx').on(table.shortCode),
  partnerIdIdx: index('partner_links_partnerId_idx').on(table.partnerId),
  productIdIdx: index('partner_links_productId_idx').on(table.productId),
}));

// Business Registrations 테이블
export const businessRegistrations = pgTable('business_registrations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  businessType: text('businessType').notNull(),
  businessName: text('businessName').notNull(),
  businessNumber: text('businessNumber').unique(), // Nullable for individuals
  representativeName: text('representativeName').notNull(),
  businessCategory: text('businessCategory'), // Nullable for individuals
  businessType2: text('businessType2'), // Nullable for individuals
  businessAddress: text('businessAddress'), // Nullable for individuals
  contactName: text('contactName').notNull(),
  contactPhone: text('contactPhone').notNull(),
  contactEmail: text('contactEmail').notNull(),
  bankName: text('bankName').notNull(),
  accountNumber: text('accountNumber').notNull(),
  accountHolder: text('accountHolder').notNull(),
  platformUrl: text('platformUrl'),
  mobileAppUrl: text('mobileAppUrl'),
  businessRegistrationDoc: text('businessRegistrationDoc'),
  bankbookDoc: text('bankbookDoc'),
  step: integer('step').notNull().default(1),
  isCompleted: boolean('isCompleted').notNull().default(false),
  sellerId: text('sellerId'), // 토스 지급대행용 Seller ID (파트너 ID와 동일)
  tossStatus: text('tossStatus'), // 토스 심사 상태 (READY, COMPLETED 등)
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Categories 테이블
export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image: text('image'),
  parentId: text('parentId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Addresses 테이블
export const addresses = pgTable('addresses', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientName: text('recipientName').notNull(),
  phone: text('phone').notNull(),
  zipCode: text('zipCode').notNull(),
  address: text('address').notNull(),
  detailAddress: text('detailAddress'),
  isDefault: boolean('isDefault').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Orders 테이블
export const orders = pgTable('orders', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderNumber: text('orderNumber').notNull().unique(),
  status: text('status').notNull().default('pending'),
  totalAmount: real('totalAmount').notNull(),
  shippingCost: real('shippingCost').notNull().default(0),
  discountAmount: real('discountAmount').notNull().default(0),
  finalAmount: real('finalAmount').notNull(),
  recipientName: text('recipientName').notNull(),
  recipientPhone: text('recipientPhone').notNull(),
  shippingAddress: text('shippingAddress').notNull(),
  shippingDetailAddress: text('shippingDetailAddress'),
  shippingZipCode: text('shippingZipCode').notNull(),
  deliveryRequest: text('deliveryRequest'),
  partnerId: text('partnerId').references(() => users.id),
  // 토스페이먼츠 지급대행용 컬럼
  partnerSellerId: text('partnerSellerId'), // 토스페이먼츠 sellerId
  partnerLinkId: text('partnerLinkId'), // 파트너 링크 ID
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Order Items 테이블
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text('orderId').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('productId').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  discountPercentage: real('discountPercentage').notNull().default(0),
  finalPrice: real('finalPrice').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Cart Items 테이블
export const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Wishlist Items 테이블
export const wishlistItems = pgTable('wishlist_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Product Questions 테이블
export const productQuestions = pgTable('product_questions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  productId: text('productId').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  isSecret: boolean('isSecret').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

// Product Answers 테이블
export const productAnswers = pgTable('product_answers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  questionId: text('questionId').notNull().references(() => productQuestions.id, { onDelete: 'cascade' }),
  answer: text('answer').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
});

