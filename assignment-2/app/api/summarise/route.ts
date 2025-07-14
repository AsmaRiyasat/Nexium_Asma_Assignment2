
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import mongoose from 'mongoose'
import { createClient } from '@supabase/supabase-js'

//  Env Vars
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
const MONGO_URI = process.env.MONGO_URI!

//  MongoDB Blog Schema
const blogSchema = new mongoose.Schema({ url: String, fullText: String })
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

//  Urdu Dictionary
const dictionary: Record<string, string> = {
  'this': 'یہ', 'is': 'ہے', 'a': '', 'an': '', 'the': '', 'and': 'اور', 'or': 'یا',
  'in': 'میں', 'on': 'پر', 'at': 'پر', 'to': 'تک', 'from': 'سے', 'for': 'کے لیے',
  'with': 'کے ساتھ', 'of': 'کا', 'by': 'کی طرف سے', 'it': 'یہ', 'as': 'کے طور پر',
  'that': 'وہ', 'be': 'ہونا', 'was': 'تھا', 'are': 'ہیں', 'will': 'ہوگا', 'can': 'سکتا ہے',
  'blog': 'بلاگ', 'article': 'مضمون', 'guide': 'رہنما', 'tutorial': 'سبق', 'content': 'مواد',
  'summary': 'خلاصہ', 'introduction': 'تعارف', 'conclusion': 'نتیجہ', 'step': 'قدم', 'steps': 'اقدامات',
  'tips': 'مشورے', 'tricks': 'چالیں', 'read': 'پڑھیں', 'write': 'لکھیں', 'start': 'شروع کریں',
  'get': 'حاصل کریں', 'started': 'شروع کیا', 'check': 'چیک کریں', 'click': 'کلک کریں',
  'link': 'لنک', 'code': 'کوڈ', 'project': 'منصوبہ', 'setup': 'ترتیب دیں', 'install': 'انسٹال کریں',
  'build': 'بنائیں', 'create': 'تخلیق کریں', 'develop': 'ترقی دیں', 'run': 'چلائیں',
  'test': 'ٹیسٹ کریں', 'debug': 'ڈی بگ کریں', 'function': 'فنکشن', 'variable': 'ویری ایبل',
  'logic': 'منطق', 'error': 'خرابی', 'fix': 'درست کریں', 'script': 'سکرپٹ', 'web': 'ویب',
  'application': 'ایپلیکیشن', 'website': 'ویب سائٹ', 'frontend': 'فرنٹ اینڈ', 'backend': 'بیک اینڈ',
  'database': 'ڈیٹابیس', 'api': 'اے پی آئی', 'server': 'سرور', 'client': 'کلائنٹ', 'platform': 'پلیٹ فارم',
  'framework': 'فریم ورک', 'tool': 'اوزار', 'library': 'لائبریری', 'javascript': 'جاوا اسکرپٹ',
  'typescript': 'ٹائپ اسکرپٹ', 'react': 'ری ایکٹ', 'next': 'نیکسٹ', 'node': 'نوڈ',
  'express': 'ایکسپریس', 'mongo': 'مونگو', 'mysql': 'مائی ایس کیو ایل', 'html': 'ایچ ٹی ایم ایل',
  'css': 'سی ایس ایس', 'deploy': 'ڈپلائے کریں', 'host': 'میزبانی کریں', 'vercel': 'ورسل',
  'netlify': 'نیٹ لائفائی', 'cloud': 'کلاؤڈ', 'serverless': 'سرور کے بغیر', 'design': 'ڈیزائن',
  'style': 'انداز', 'layout': 'لے آؤٹ', 'user': 'صارف', 'interface': 'انٹرفیس', 'experience': 'تجربہ',
  'free': 'مفت', 'open': 'کھلا', 'source': 'ماخذ', 'fast': 'تیز', 'easy': 'آسان',
  'simple': 'سادہ', 'advanced': 'اعلی سطحی', 'secure': 'محفوظ', 'powerful': 'طاقتور',
  'now': 'اب', 'today': 'آج', 'soon': 'جلد', 'before': 'پہلے', 'after': 'بعد',
  'learn': 'سیکھیں', 'explore': 'دریافت کریں', 'improve': 'بہتر بنائیں', 'Start': 'شروع کریں',
  'finish': 'مکمل کریں', 'understand': 'سمجھیں', 'know': 'جانیں', 'use': 'استعمال کریں',
  'help': 'مدد کریں',
}

// 🔎 Fake Summary Generator
function fakeSummarise(text: string) {
  const paragraphs = text.split('\n').filter(p => p.trim().length > 50)
  const bestPara = paragraphs.sort((a, b) => b.length - a.length)[0] || ''
  return bestPara.split('.').slice(0, 2).join('.') + '.'
}

// 🌐 Translate summary to Urdu
function translateToUrdu(text: string) {
  return text
    .split(' ')
    .map(word => dictionary[word.toLowerCase()] || word)
    .join(' ')
}

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const html = (await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36',
      },
    })).data

    const $ = cheerio.load(html)
    const fullText = $('p').text()

    await mongoose.connect(MONGO_URI)
    await Blog.create({ url, fullText })

    const summary = fakeSummarise(fullText)
    const urduTranslation = translateToUrdu(summary)

    // await supabase.from('summarise').insert([{ url, summary, urdu: urduTranslation }])
    const { error: supabaseError } = await supabase
    .from('summarise')
    .insert([{ url, summary, urdu: urduTranslation }])

    if (supabaseError) {
     console.error(' Supabase insert error:', supabaseError)
    }

    return NextResponse.json({
      summary,
      urduTranslation,
      fullBlog: fullText
    })
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json({ error: "Failed to summarise blog." }, { status: 500 });
  }
}
