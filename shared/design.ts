// Compact runtime mapping. The full audit snapshot is never shipped to clients.
export const designNodes = {
  'navbar': { desktop: '2617:11149', mobile: '2617:10927' },
  'hero': { desktop: '2617:11150', mobile: '2617:10928' },
  'story': { desktop: '2617:11165', mobile: '2617:10943' },
  'tiktok': { desktop: '2617:11176', mobile: '2617:10952' },
  'course': { desktop: '2617:11205', mobile: '2617:10977' },
  'training': { desktop: '2617:11215', mobile: '2617:10987' },
  'values': { desktop: '2617:11226', mobile: '2617:10996' },
  'book-1': { desktop: '2617:11234', mobile: '2617:11003' },
  'book-2': { desktop: '2617:11247', mobile: '2617:11016' },
  'book-3': { desktop: '2617:11260', mobile: '2617:11029' },
  'cooperation': { desktop: '2617:11273', mobile: '2617:11042' },
  'process': { desktop: '2617:11284', mobile: '2617:11052' },
  'press': { desktop: '2617:11293', mobile: '2617:11060' },
  'partners': { desktop: '2617:11301', mobile: '2617:11067' },
  'contact': { desktop: '2617:11333', mobile: '2617:11105' },
  'faq': { desktop: '2617:11352', mobile: '2617:11127' },
  'footer': { desktop: '2617:11361', mobile: '2617:11135' },
  drawer: { desktop: '2617:11382', mobile: '2617:11382' },
  sticky: { desktop: '2617:11380', mobile: '2617:11380' },
} as const

export type DesignKey = keyof typeof designNodes
export function designAttrs(key: DesignKey) {
  const node = designNodes[key]
  return { 'data-design-key': key, 'data-figma-desktop-id': node.desktop, 'data-figma-mobile-id': node.mobile }
}
