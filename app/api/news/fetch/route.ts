import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const RSS_SOURCES = [
  { url: 'https://feeds.feedburner.com/TechCrunch',                    source: 'TechCrunch' },
  { url: 'https://www.artificialintelligence-news.com/feed/',          source: 'AI News' },
  { url: 'https://venturebeat.com/category/ai/feed/',                  source: 'VentureBeat' },
  { url: 'https://www.wired.com/feed/tag/artificial-intelligence/rss', source: 'Wired' },
]

function extractCDATA(raw: string): string {
  return raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function parseRSS(xml: string, sourceName: string): Array<{
  title: string; description: string; url: string; source: string;
  published_at: string; category: string;
}> {
  const items: ReturnType<typeof parseRSS> = []
  const blocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? []

  for (const block of blocks) {
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
      return m ? extractCDATA(m[1]) : ''
    }
    const linkM = block.match(/<link>([\s\S]*?)<\/link>/)
    const title = get('title')
    const url   = linkM ? linkM[1].trim() : get('guid')
    if (!title || !url || !url.startsWith('http')) continue

    const pubRaw = get('pubDate')
    let published_at: string
    try { published_at = new Date(pubRaw).toISOString() }
    catch { published_at = new Date().toISOString() }

    items.push({
      title:       title.substring(0, 255),
      description: get('description').replace(/<[^>]*>/g, '').substring(0, 600),
      url,
      source:      sourceName,
      published_at,
      category:    'ai',
    })
  }
  return items
}

export async function POST() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  let inserted = 0

  for (const { url, source } of RSS_SOURCES) {
    try {
      const res  = await fetch(url, { next: { revalidate: 0 } })
      const xml  = await res.text()
      const parsed = parseRSS(xml, source)

      if (parsed.length > 0) {
        await supabase
          .from('news_items')
          .upsert(parsed, { onConflict: 'url', ignoreDuplicates: true })
        inserted += parsed.length
      }
    } catch { /* skip source on error */ }
  }

  return NextResponse.json({ success: true, inserted })
}
