export type DataSlider = {
  map: string
  max: number
  min: number
}

export type CreateSlider = {
  number: () => void
  slide: () => void
  title: () => void
}
