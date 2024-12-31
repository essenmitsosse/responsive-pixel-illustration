import type { DynamicVariable } from '@/renderengine/Variable'

export type State = {
  addX: number | null
  addY: number | null
  calculateList:
    | ((dimensions: { height: number; width: number }) => void)
    | null
  dimensionHeight: number | null
  dimensionWidth: number | null
  updateList: (() => void) | null
  variableListCreate: ((name: string) => DynamicVariable) | null
  variableListLink: ((name: string, vari: { abs?: number }) => void) | null
}
