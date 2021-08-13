import { CNP } from '../index'
import { describe, expect, test } from '@jest/globals'

describe.each([
  // cnp, isValid, birthDates, yy, birthPlace, gender, hasIdentityCard, serialNumber, cnpOut
  ['123', false, 'Invalid date', 'Invalid date', null, '', false, '', 'Invalid CNP'],
  ['x5110102441483', false, 'Invalid date', 'Invalid date', null, '', false, '', 'Invalid CNP'],
  ['511010244x1483', false, 'Invalid date', 'Invalid date', null, '', false, '', 'Invalid CNP'],
  ['5110102441483', true, '2011-01-02', '11', 'București - Sector 4', 'male', false, '148', '5110102441483'],
  ['6140101070075', true, '2014-01-01', '14', 'Botoșani', 'female', false, '007', '6140101070075'],
  ['3970908055828', true, '1897-09-08', '97', 'Bihor', 'male', true, '582', '3970908055828'],
  ['2970702435244', true, '1997-07-02', '97', 'București - Sector 3', 'female', true, '524', '2970702435244'],
  // he was not born
  ['6990504015905', true, '2099-05-04', '99', 'Alba', 'female', false, '590', '6990504015905'],
  // resident
  ['9990504015919', true, '1999-05-04', '99', 'Alba', '', true, '591', '9990504015919'],
  // check sum
  ['1850611212751', true, '1985-06-11', '85', 'Ialomița', 'male', true, '275', '1850611212751'],
])(
  '.try to validate CNP %s',
  (cnp, isValid, birthDates, yy, birthPlace, gender, hasIdentityCard, serialNumber, cnpOut) => {
    const cnpObj = new CNP(cnp)

    test(`isValid() method return '${isValid}'`, () => {
      expect(cnpObj.isValid()).toBe(isValid)
    })

    test(`getBirthDate() method return '${birthDates}'`, () => {
      expect(cnpObj.getBirthDate()).toBe(birthDates)
    })

    test(`getBirthPlace() method return '${birthPlace}'`, () => {
      expect(cnpObj.getBirthPlace()).toBe(birthPlace)
    })

    test(`getGender() method return '${gender}'`, () => {
      expect(cnpObj.getGender()).toBe(gender)
    })

    test(`hasIdentityCard() method return '${hasIdentityCard}'`, () => {
      expect(cnpObj.hasIdentityCard()).toBe(hasIdentityCard)
    })

    test(`getSerialNumberFromCNP() method return '${serialNumber}'`, () => {
      expect(cnpObj.getSerialNumberFromCNP()).toBe(serialNumber)
    })

    test(`cnp getter method return '${cnp}'`, () => {
      expect(cnpObj.cnp).toBe(cnpOut)
    })

    cnpObj.cnp = cnp
    test(`after using set isValid() method return '${isValid}'`, () => {
      expect(cnpObj.isValid()).toBe(isValid)
    })

    test(`after using set getBirthDate('YY') method return '${yy}'`, () => {
      expect(cnpObj.getBirthDate('YY')).toBe(yy)
    })
  },
)
