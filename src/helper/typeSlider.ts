export type DataSlider = {
  map: string
  max: number
  min: number
}

export type SliderArgs = {
  defaultValue: number
  dontShow?: boolean
  input: DataSlider
  niceName: string
  output?: { max: number; min: number }
  valueName: string
}

export type CreateSlider = {
  number: (args: SliderArgs) => void
  slider: (args: SliderArgs) => void
  title: (args: { title: string }) => void
}
