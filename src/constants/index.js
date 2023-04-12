export const BASE_API = 'http://localhost:8080/api'
export const SECTION_BORDER_COLOR = '#E4E6EB'
export const textEllipsis = (line = 2) => ({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  WebkitLineClamp: line,
  WebkitBoxOrient: 'vertical',
  display: '-webkit-box'
})
export const FILE_TYPE = {
  'IMAGE': 'image',
  'VIDEO': 'video',
  'RAW': 'raw'
}