export function figmaLinearGradient(fill, width, height) {
  const [[a, b, c]] = fill.gradientTransform
  const span = Math.abs(a) + Math.abs(b)
  if (!span || width <= 0 || height <= 0) throw new Error('Invalid gradient geometry')
  const angle = (Math.atan2(a / width, -b / height) * 180 / Math.PI + 360) % 360
  const start = c + Math.min(0, a) + Math.min(0, b)
  const stops = fill.gradientStops.map(({color, position}) => {
    const rgb = [color.r, color.g, color.b].map(v => Math.round(v * 255)).join(' ')
    return `rgb(${rgb} / ${color.a * (fill.opacity ?? 1)}) ${(position - start) / span * 100}%`
  })
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`
}
