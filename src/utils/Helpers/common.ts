import { ChipTypes } from "@/components/Chip"

export enum TimeUnites {
  MINUTES = 'Minutes',
  HOURS = 'Hours',
}

/**
 * @param {string} value value to be converted
 * @param {TimeUnites} unit time unit of the value
 * @returns value converted to minutes
 */
export const getTimeInMinutes = (value: number, unit: TimeUnites): number => {
  if (unit === TimeUnites.MINUTES) {
    return Number(value)
  }
  return Number(value) * 60
}

/**
 * @param {number | string} value value to be converted
 * @returns value in Hour Minutes format
 */
export const formatTimeInHourMinutes = (value: number | string): string => {
  const time = Number(value)
  if (time < 60) {
    return `${time} Minutes`
  }
  const hours = Math.floor(time / 60)
  const minutes = time % 60

  if (minutes === 0) {
    return `${hours} Hour`
  }

  return `${hours} Hour ${minutes} Minutes`
}

/**
 * @param {string} url url with params to be replaced
 * @param {string[]} params params values
 * @returns url with replaced params
 */
export const addParamsInUrl = (url: string, ...params: string[]) => {
  let updatedUrl = url
  params.forEach((param) => {
    updatedUrl = updatedUrl.replace(/:\w+/, param)
  })
  return updatedUrl
}

/**
 * @param {string} value value to be used to determine the chip type
 * @param {string} type time | difficulty
 * @returns chip type based on the value
 */
export const getChipType = (value: string | number, type?: string): ChipTypes => {
  if (type === 'time') {
    const time = Number(value)
    switch (true) {
      case time <= 30:
        return ChipTypes.SUCCESS
      case time > 30 && time <= 60:
        return ChipTypes.WARNING
      case time > 60:
        return ChipTypes.DANGER
      default:
        return ChipTypes.DEFAULT
    }
  }

  switch (String(value).toLowerCase()) {
    case 'easy':
      return ChipTypes.SUCCESS
    case 'medium':
      return ChipTypes.WARNING
    case 'hard':
      return ChipTypes.DANGER
    default:
      return ChipTypes.DEFAULT
  }
}
