import PptxGenJS from 'pptxgenjs'

export const getSlideLayoutOptions = () => {
  return [
    { value: 'LAYOUT_16x9', width: 10, height: 5.625, label: '16x9' },
    { value: 'LAYOUT_16x10', width: 10, height: 6.25, label: '16x10' },
    { value: 'LAYOUT_4x3', width: 10, height: 7.5, label: '4x3' },
    { value: 'LAYOUT_WIDE', width: 13.3, height: 7.5, label: 'Wide' },
    { value: 'LAYOUT_USER', label: 'User defined' }
  ]
}

export const generatePowerPointFromExportContainer = (containerEl, layout = { value: 'LAYOUT_16x9' }) => {
  console.log('CONTAINER EL', containerEl)
  if (!isElement(containerEl)) throw Error('invalid container element')
  if (containerEl.className.split(' ').filter(c => c === 'grid-container').length !== 1) throw Error(`invalid element attribute passed, expected "grid-container" element`)

  // Get container origin
  const { left, top, width, height } = containerEl.getBoundingClientRect()
  // eslint-disable-next-line
  const origin = { x0: window.scrollX + left, y0: window.scrollY + top, width, height }

  const pptx = new PptxGenJS()
  pptx.setLayout(layout.value === 'LAYOUT_USER' ? { name: 'custom_layout', width: layout.width, height: layout.height } : layout.value)
  // eslint-disable-next-line
  const slide = pptx.addNewSlide()

  pptx.save('Sample Presentation')
}

// Returns true if it is a DOM element
export const isElement = o => typeof HTMLElement === 'object' ? o instanceof HTMLElement : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'

/*
const rgbToHex = rgb => {
  const matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/
  const match = matchColors.exec(rgb)
  if (match.length === 4) {
    // eslint-disable-next-line
    const [ _, r, g, b ] = match
    return [r, g, b].map(color => { const hex = Number(color).toString(16); return hex.length < 2 ? `0${hex}` : hex }).join('')
  }
  return 'ffffff'
}
*/
