import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Decode basic HTML entities for accurate matching
function decodeHtml(html) {
  return html
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
}

function normalize(text) {
  return text.trim().replace(/\s+/g, ' ')
}

async function runAudit() {
  const specsPath = resolve(process.cwd(), 'scratch/portfolio-koc-detailed-specs.json')
  const htmlPath = resolve(process.cwd(), '.output/public/index.html')

  const specs = JSON.parse(readFileSync(specsPath, 'utf8'))
  const rawHtml = readFileSync(htmlPath, 'utf8')
  const decodedHtml = decodeHtml(rawHtml)

  console.log('='.repeat(80))
  console.log('🔍 BÁO CÁO NGHIỆM THU ĐỐI SOÁT TỰ ĐỘNG (FIGMA SPECS VS PRODUCTION HTML)')
  console.log('='.repeat(80))

  let totalFigmaTexts = 0
  let totalMatchedTexts = 0
  const report = []

  for (let idx = 0; idx < specs.length; idx++) {
    const frame = specs[idx]
    const validTexts = (frame.texts || [])
      .map(t => normalize(t.characters || ''))
      .filter(t => t.length > 0 && t !== '*')

    // Unique texts per frame to avoid duplicate counting of spacers
    const uniqueTexts = Array.from(new Set(validTexts))
    const matched = []
    const missing = []

    for (const text of uniqueTexts) {
      totalFigmaTexts++
      // Check exact or normalized containment
      if (decodedHtml.includes(text)) {
        matched.push(text)
        totalMatchedTexts++
      } else {
        // Check partial match for long paragraphs or slightly normalized punctuation
        const simplified = text.replace(/["'.,:!?]/g, '').trim()
        if (simplified.length > 10 && decodedHtml.replace(/["'.,:!?]/g, '').includes(simplified)) {
          matched.push(text + ' (Khớp mềm / normalize)')
          totalMatchedTexts++
        } else {
          missing.push(text)
        }
      }
    }

    const rate = uniqueTexts.length > 0 
      ? Math.round((matched.length / uniqueTexts.length) * 100) 
      : 100

    report.push({
      idx,
      id: frame.id,
      name: frame.name,
      totalTexts: uniqueTexts.length,
      matchedCount: matched.length,
      rate,
      matched,
      missing,
      imagesCount: (frame.images || []).length,
      buttonsCount: (frame.buttons || []).length,
    })
  }

  // Summary Table
  console.log('\n📊 TỔNG HỢP THEO 17 FRAMES FIGMA:')
  console.log('-'.repeat(80))
  console.log(
    'STT'.padEnd(5) +
    'Tên Frame'.padEnd(18) +
    'Figma ID'.padEnd(12) +
    'Số Texts'.padEnd(10) +
    'Khớp'.padEnd(8) +
    'Tỷ Lệ %'.padEnd(10) +
    'Ảnh/Nút'
  )
  console.log('-'.repeat(80))

  for (const r of report) {
    const statusColor = r.rate === 100 ? '✅' : r.rate >= 80 ? '⚡' : '⚠️'
    console.log(
      `${r.idx.toString().padEnd(4)} ` +
      `${r.name.padEnd(17)} ` +
      `${r.id.padEnd(11)} ` +
      `${r.totalTexts.toString().padEnd(9)} ` +
      `${r.matchedCount.toString().padEnd(7)} ` +
      `${statusColor} ${r.rate}%`.padEnd(12) +
      `Img: ${r.imagesCount} | Btn: ${r.buttonsCount}`
    )
  }

  console.log('-'.repeat(80))
  const overallRate = totalFigmaTexts > 0 ? Math.round((totalMatchedTexts / totalFigmaTexts) * 100) : 100
  console.log(`\n🏆 TỔNG TỶ LỆ KHỚP NỘI DUNG TOÀN TRANG: ${overallRate}% (${totalMatchedTexts}/${totalFigmaTexts} nodes)`)
  console.log('='.repeat(80))

  // Detail for frames with missing items (to explain placeholders/duplications)
  const incomplete = report.filter(r => r.missing.length > 0)
  if (incomplete.length > 0) {
    console.log('\n📝 CHI TIẾT CÁC TEXT DỊ BIỆT HOẶC PLACEHOLDER CẦN GIẢI TRÌNH:')
    for (const inc of incomplete) {
      console.log(`\n[${inc.name} - ${inc.id}] (Tỷ lệ: ${inc.rate}%)`)
      for (const m of inc.missing) {
        console.log(`  - Thiếu hoặc khác biệt: "${m}"`)
      }
    }
  }
}

runAudit().catch(console.error)
