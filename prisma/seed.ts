import 'dotenv/config';
import {
  PrismaClient,
  Role,
  PostStatus,
} from '../generated/prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('🌱 Seeding database...');

  // 1. Users (အသုံးပြုသူများ)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'ကျော်စွာ',
      bio: 'ဆိုက်၏ အက်ဒမင်နှင့် ပင်မတည်းဖြတ်သူ ဖြစ်ပါသည်။',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  const authorUser = await prisma.user.upsert({
    where: { email: 'author@example.com' },
    update: {},
    create: {
      email: 'author@example.com',
      name: 'မြမြ',
      bio: 'နည်းပညာနှင့် ပတ်သက်သော ဆောင်းပါးများကို ရေးသားသူဖြစ်ပါသည်။',
      role: Role.EDITOR,
      emailVerified: true,
    },
  });

  const subscriberUser = await prisma.user.upsert({
    where: { email: 'reader@example.com' },
    update: {},
    create: {
      email: 'reader@example.com',
      name: 'အောင်အောင်',
      role: Role.SUBSCRIBER,
      emailVerified: true,
    },
  });

  // 2. Categories (ကဏ္ဍများ)
  const techCategory = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      name: 'နည်းပညာ',
      slug: 'technology',
      description: 'နောက်ဆုံးပေါ် နည်းပညာသတင်းများနှင့် ဆောင်းပါးများ',
    },
  });

  const healthCategory = await prisma.category.upsert({
    where: { slug: 'health' },
    update: {},
    create: {
      name: 'ကျန်းမာရေး',
      slug: 'health',
      description: 'ကျန်းမာရေးနှင့် ပတ်သက်သော ဗဟုသုတများ',
    },
  });

  const webTag = await prisma.tag.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: { name: 'ဝက်ဘ်ဖွံ့ဖြိုးတိုးတက်မှု', slug: 'web-development' },
  });

  const aiTag = await prisma.tag.upsert({
    where: { slug: 'artificial-intelligence' },
    update: {},
    create: { name: 'ဉာဏ်ရည်တု', slug: 'artificial-intelligence' },
  });

  const post1 = await prisma.post.upsert({
    where: { slug: 'future-of-web-development-2026' },
    update: {},
    create: {
      title: '၂၀၂၆ ခုနှစ်အတွက် ဝက်ဘ်ဖွံ့ဖြိုးတိုးတက်မှု အလားအလာများ',
      slug: 'future-of-web-development-2026',
      summary:
        'ယခုနှစ်အတွင်း ပြောင်းလဲလာမည့် ဝက်ဘ်နည်းပညာ အသစ်များအကြောင်း လေ့လာကြည့်ရအောင်။',
      content:
        'ယနေ့ခေတ်တွင် ဝက်ဘ်နည်းပညာများသည် အလွန်လျင်မြန်စွာ တိုးတက်လျက်ရှိပါသည်။ React, Vue စသည့် Framework များအပြင် Server-side rendering နည်းပညာများသည်လည်း ပိုမိုတွင်ကျယ်လာပါသည်။...',
      readingTimeMinutes: 5,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: authorUser.id,
      categoryId: techCategory.id,
      metaTitle: '၂၀၂၆ ဝက်ဘ်ဖွံ့ဖြိုးတိုးတက်မှု',
      metaDescription: 'ဝက်ဘ်နည်းပညာ အသစ်များအကြောင်း',
      tags: {
        connect: [{ id: webTag.id }],
      },
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'ai-in-daily-life' },
    update: {},
    create: {
      title: 'နေ့စဉ်ဘဝတွင် ဉာဏ်ရည်တု (AI) ၏ အခန်းကဏ္ဍ',
      slug: 'ai-in-daily-life',
      summary:
        'AI နည်းပညာသည် ကျွန်ုပ်တို့၏ နေ့စဉ်လုပ်ငန်းဆောင်တာများကို မည်သို့ ကူညီပေးနေသနည်း။',
      content:
        'AI သည် ယခုအခါ စီးပွားရေးလုပ်ငန်းများသာမက သာမန်လူတို့၏ နေ့စဉ်ဘဝတွင်ပါ မရှိမဖြစ် ပါဝင်လာပြီ ဖြစ်ပါသည်။...',
      readingTimeMinutes: 4,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: techCategory.id,
      tags: {
        connect: [{ id: aiTag.id }],
      },
    },
  });

  // 5. Post Likes (အကြိုက်များ)
  await prisma.postLike.createMany({
    data: [
      { postId: post1.id, userId: subscriberUser.id },
      { postId: post2.id, userId: subscriberUser.id },
    ],
    skipDuplicates: true,
  });

  // 7. Newsletter Subscribers (သတင်းလွှာ ရယူသူများ)
  await prisma.newsletterSubscriber.upsert({
    where: { email: 'hello@myanmar.com' },
    update: {},
    create: {
      email: 'hello@myanmar.com',
      isConfirmed: true,
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
