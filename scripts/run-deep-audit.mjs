import { execSync } from 'node:child_process'
import { readFileSync, existsSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

async function main() {
  console.log('='.repeat(90))
  console.log('🔬 KHỞI CHẠY HỆ THỐNG KIỂM TOÁN TOÀN DIỆN FIGMA VS REAL DOM (FULL-FIDELITY AUDIT)')
  console.log('   Bao gồm: Typography & Màu sắc | Layout Box-Model (Padding) | Spacing/Gaps | Kích thước Nút & Ảnh')
  console.log('='.repeat(90))

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  const targetUrl = 'http://localhost:3103/?inspect=true'
  const reportPath = resolve(process.cwd(), 'scratch/real-dom-computed-audit.json')

  // Remove stale report to guarantee fresh measurement
  if (existsSync(reportPath)) {
    try {
      unlinkSync(reportPath)
    } catch {
      // Ignore
    }
  }

  console.log(`📡 Đang kết nối Trình duyệt Chrome Headless (Viewport: 1440x900) vào: ${targetUrl}...`)

  try {
    // Run Chrome headless for 4.5s
    execSync(`"${chromePath}" --headless=new --window-size=1440,900 --virtual-time-budget=5000 "${targetUrl}"`, {
      stdio: 'ignore',
      timeout: 15000,
    })
  } catch {
    // Chrome headless timeout or normal exit
  }

  // Poll for report file if not yet written
  const startTime = Date.now()
  while (!existsSync(reportPath) && Date.now() - startTime < 7000) {
    await new Promise(r => setTimeout(r, 300))
  }

  if (!existsSync(reportPath)) {
    console.error('❌ Không tìm thấy file kết quả đo đạc từ trình duyệt!')
    return
  }

  const rawData = readFileSync(reportPath, 'utf8')
  const report = JSON.parse(rawData)

  console.log(`\n📊 BẢNG TỔNG HỢP KIỂM TOÁN ĐỊNH LƯỢNG TRÊN 1440PX DESKTOP VIEWPORT:`)
  console.log('='.repeat(90))
  console.log(`1. 📝 Typography & Màu sắc (Text Leaf Nodes):`)
  console.log(`   - Tổng số nodes: ${report.totalNodesAudited}`)
  console.log(`   - Chuẩn 100% (PASS): ${report.passCount} ✅`)
  console.log(`   - Sai lệch (FAIL): ${report.failCount} ❌`)
  console.log(`   - Độ chuẩn xác: ${report.passRate}%\n`)

  console.log(`2. 📐 Layout & Box Model (Container Paddings & Spacing):`)
  console.log(`   - Tổng số sections đo: ${report.layoutAudit?.total || 0}`)
  console.log(`   - Chuẩn 100% (PASS): ${report.layoutAudit?.pass || 0} ✅`)
  console.log(`   - Sai lệch (FAIL): ${report.layoutAudit?.fail || 0} ❌`)
  console.log(`   - Độ chuẩn xác: ${report.layoutAudit?.passRate || 0}%\n`)

  console.log(`3. 🔘 Kích thước Interactive Buttons (Width x Height):`)
  console.log(`   - Tổng số nút đo: ${report.buttonAudit?.total || 0}`)
  console.log(`   - Chuẩn 100% (PASS): ${report.buttonAudit?.pass || 0} ✅`)
  console.log(`   - Sai lệch (FAIL): ${report.buttonAudit?.fail || 0} ❌`)
  console.log(`   - Độ chuẩn xác: ${report.buttonAudit?.passRate || 0}%\n`)

  console.log(`4. 🖼️ Kích thước Media & Images (Width x Height):`)
  console.log(`   - Tổng số ảnh đo: ${report.imageAudit?.total || 0}`)
  console.log(`   - Chuẩn 100% (PASS): ${report.imageAudit?.pass || 0} ✅`)
  console.log(`   - Sai lệch (FAIL): ${report.imageAudit?.fail || 0} ❌`)
  console.log(`   - Độ chuẩn xác: ${report.imageAudit?.passRate || 0}%`)
  console.log('-'.repeat(90))

  const totalChecks = report.totalNodesAudited + (report.layoutAudit?.total || 0) + (report.buttonAudit?.total || 0) + (report.imageAudit?.total || 0)
  const totalPass = report.passCount + (report.layoutAudit?.pass || 0) + (report.buttonAudit?.pass || 0) + (report.imageAudit?.pass || 0)
  const totalFail = report.failCount + (report.layoutAudit?.fail || 0) + (report.buttonAudit?.fail || 0) + (report.imageAudit?.fail || 0)
  const grandPassRate = totalChecks > 0 ? Math.round((totalPass / totalChecks) * 100) : 100

  console.log(`🏆 TỔNG THỂ HỆ THỐNG: ${totalPass}/${totalChecks} chỉ số đạt chuẩn (${grandPassRate}%)`)
  console.log('='.repeat(90))

  // Detailed Failure Logging
  let hasFailures = totalFail > 0
  if (hasFailures) {
    console.log('\n🚨 CHI TIẾT CÁC ĐIỂM SAI LỆCH CẦN ĐIỀU CHỈNH THEO TỪNG PHÂN HỆ:')
    console.log('='.repeat(90))

    for (const frame of (report.frames || [])) {
      const layoutFail = frame.layout && frame.layout.status !== 'PASS'
      const btnFails = (frame.buttons || []).filter(b => b.status !== 'PASS')
      const imgFails = (frame.images || []).filter(img => img.status !== 'PASS')
      const textFails = (frame.nodes || []).filter(n => n.status !== 'PASS')

      if (!layoutFail && btnFails.length === 0 && imgFails.length === 0 && textFails.length === 0) {
        continue
      }

      console.log(`\n📁 PHÂN HỆ: [${frame.frameName}] (ID: ${frame.frameId})`)
      console.log('-'.repeat(90))

      // 1. Layout fails
      if (layoutFail) {
        console.log(`  📐 [Layout & Box-Model]:`)
        for (const diff of frame.layout.diffs) {
          console.log(`     ❌ ${diff}`)
        }
        console.log(`     🔍 Figma: [PT: ${frame.layout.figma.paddingTop}px, PB: ${frame.layout.figma.paddingBottom}px, PL: ${frame.layout.figma.paddingLeft}px, PR: ${frame.layout.figma.paddingRight}px, Gap: ${frame.layout.figma.itemSpacing}px]`)
        console.log(`     👉 DOM:   [PT: ${frame.layout.dom.paddingTop}px, PB: ${frame.layout.dom.paddingBottom}px, PL: ${frame.layout.dom.paddingLeft}px, PR: ${frame.layout.dom.paddingRight}px, Gap: ${frame.layout.dom.itemSpacing}px]`)
      }

      // 2. Button fails
      if (btnFails.length > 0) {
        console.log(`  🔘 [Buttons]:`)
        for (const b of btnFails) {
          console.log(`     ❌ Nút "${b.name}":`)
          for (const d of b.diffs) {
            console.log(`        - ${d}`)
          }
          console.log(`        👉 Figma: ${b.figma.width}x${b.figma.height}px vs DOM: ${b.dom?.width || 0}x${b.dom?.height || 0}px ("${b.dom?.text || ''}")`)
        }
      }

      // 3. Image fails
      if (imgFails.length > 0) {
        console.log(`  🖼️ [Images]:`)
        for (const img of imgFails) {
          console.log(`     ❌ Ảnh "${img.name}":`)
          for (const d of img.diffs) {
            console.log(`        - ${d}`)
          }
          console.log(`        👉 Figma: ${img.figma.width}x${img.figma.height}px vs DOM: ${img.dom?.width || 0}x${img.dom?.height || 0}px`)
        }
      }

      // 4. Text fails
      if (textFails.length > 0) {
        console.log(`  📝 [Typography/Colors]:`)
        for (const node of textFails) {
          console.log(`     ❌ Text "${node.text}":`)
          for (const d of (node.diffs || [])) {
            console.log(`        - ${d}`)
          }
        }
      }
    }
  } else {
    console.log('\n🎉 XUẤT SẮC! Toàn bộ 17 frames đều đạt 100% chuẩn xác cả về Typography, Màu sắc, Box-Model Layout, Spacing và Kích thước Nút/Ảnh!')
  }

  console.log('\n' + '='.repeat(90))
}

main().catch(console.error)
