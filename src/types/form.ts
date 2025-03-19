export type Status = 'Pending' | 'Settled'
export type TimeFrame = '12 months' | '12-36 months' | '36 months'
export type DefinitionMatch = 'Matches definition' | 'Does NOT match definition'
export type ClassType = 'Class' | 'PAGA'
export type LDWDate = string
export type ElevenMonthsStatus = '11 months has passed' | '11 months HAS NOT passed'

export interface FormData {
  status: Status
  caseNumber: string
  timeFrame: TimeFrame
  date: string
  lawFirm: string
  definitionMatch: DefinitionMatch
  description: string
  hasMultipleDefendants: boolean
  defendantNames: string[]
  paDate: string
  faDate: string
  noPADate: boolean
  noFADate: boolean
  classType: ClassType
  periodEndDate: string
  ldwDate: LDWDate
  elevenMonthsPassed: ElevenMonthsStatus
  liabilityCalc: string
  hasDescription: boolean
} 