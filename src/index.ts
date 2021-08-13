import * as moment from 'moment/moment'

const controlKey: number[] = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9]
const countyCode: { [key: string]: string } = {
  '01': 'Alba',
  '02': 'Arad',
  '03': 'Argeș',
  '04': 'Bacău',
  '05': 'Bihor',
  '06': 'Bistrița-Năsăud',
  '07': 'Botoșani',
  '08': 'Brașov',
  '09': 'Brăila',
  '10': 'Buzău',
  '11': 'Caraș-Severin',
  '12': 'Cluj',
  '13': 'Constanța',
  '14': 'Covasna',
  '15': 'Dambovița',
  '16': 'Dolj',
  '17': 'Galați',
  '18': 'Gorj',
  '19': 'Harghita',
  '20': 'Hunedoara',
  '21': 'Ialomița',
  '22': 'Iași',
  '23': 'Ilfov',
  '24': 'Maramureș',
  '25': 'Mehedinți',
  '26': 'Mureș',
  '27': 'Neamț',
  '28': 'Olt',
  '29': 'Prahova',
  '30': 'Satu Mare',
  '31': 'Sălaj',
  '32': 'Sibiu',
  '33': 'Suceava',
  '34': 'Teleorman',
  '35': 'Timiș',
  '36': 'Tulcea',
  '37': 'Vaslui',
  '38': 'Vâlcea',
  '39': 'Vrancea',
  '40': 'București',
  '41': 'București - Sector 1',
  '42': 'București - Sector 2',
  '43': 'București - Sector 3',
  '44': 'București - Sector 4',
  '45': 'București - Sector 5',
  '46': 'București - Sector 6',
  '51': 'Calarași',
  '52': 'Giurgiu',
  '47': 'București - Sector 7(desfiintat)',
  '48': 'București - Sector 8(desfiintat)',
}

/**
 * Class CNP - Validation for Romanian Social Security Number (CNP)
 *
 * Valid format: (string of 13 numbers:
 * |S|YY|MM|DD|CC|XXX|C|
 * where :
 * |S|  - Gender number (Male/Women) for:
 *      1/2 - romanian citizen born between 1900.01.01 and 1999.12.31
 *      3/4 - romanian citizen born between 1800.01.01 and 1899.12.31
 *      5/6 - romanian citizen born between 2000.01.01 and 2099.12.31
 *      7/8 - residents
 *      9   - people with foreign citizenship
 *
 * |YY| - year of birth - 00 - 99 - [are valid years only the range 1800-2099]
 * |MM| - birth month - 01 - 12
 * |DD| - birthday - 01 - 28/29/30/31
 * |CC| - county code - for a valid value check CNP::$countyCode
 * |XXX|- the serial number assigned to the person - 000 - 999
 * |C|  - check Digit
 *
 * @see https://ro.wikipedia.org/wiki/Cod_numeric_personal
 * @author Niku Alcea <nicu(dotta)alcea(atta)gmail(dotta)com>
 *
 * How to install it?
 *
 * ```
 * npm i --save romanian-personal-identity-code-validator
 * ```
 *
 * How to use it?
 *
 * ```js
 * let cnp = new CNP('123');
 * // or use a setter
 * cnp.cnp = '1234';
 *
 * if (cnp.isValid()) {
 *   // extract information from an valid CNP
 *   console.log(cnp.getBirthDate());           // default format 'YYYY-MM-DD'
 *   console.log(cnp.getBirthDate('YYYY'));     // or only the year
 *   console.log(cnp.getBirthPlace());
 *   console.log(cnp.getGender());              // default male | female
 *   console.log(cnp.getGender('M', 'F'));      // or set a custom value M | F
 *   console.log(cnp.hasIdentityCard());        // if the age is grater than 14 years
 *   console.log(cnp.getSerialNumberFromCNP());
 * }
 *
 * ```
 * @classdesc - Atention class validate if CNP format if valid! Class can return true evan that CNP do not exist!
 * eg: 6990504015905 is valid but this CNP do not exist in reality (date of birth for this CNP is 2099-05-04)!
 */
export class CNP {
  private _cnpArray: number[] = []
  private _isValid = false
  private _year: number = 0
  private _month: string = ''
  private _day: string = ''
  private _cc: string = ''

  constructor(cnp: string = '') {
    this.init(cnp)
  }

  get cnp(): string {
    if (!this._isValid) {
      return 'Invalid CNP'
    }

    return this._cnpArray.join('')
  }

  set cnp(cnp: string) {
    this.init(cnp)
  }

  public isValid(): boolean {
    return this._isValid
  }

  public getBirthDate(format: string = 'YYYY-MM-DD'): string {
    if (!this._isValid) {
      return 'Invalid date'
    }

    return moment(this.dateInput()).format(format)
  }

  public getBirthPlace(): string | null {
    if (!this._isValid) {
      return null
    }
    return countyCode[this._cc]
  }

  public getGender(m: string = 'male', f: string = 'female'): string {
    let gender = ''
    if (this._isValid) {
      if ([1, 3, 5, 7].indexOf(this._cnpArray[0]) !== -1) {
        gender = m
      }

      if ([2, 4, 6, 8].indexOf(this._cnpArray[0]) !== -1) {
        gender = f
      }
    }

    return gender
  }

  public hasIdentityCard(): boolean {
    if (!this._isValid) {
      return false
    }

    const birthDate = moment(this.dateInput(), 'YYYY-MM-DD')

    return Math.floor(moment(new Date()).diff(birthDate, 'years', true)) > 14
  }

  public getSerialNumberFromCNP(): string {
    return this._isValid ? `${this._cnpArray[9]}${this._cnpArray[10]}${this._cnpArray[11]}` : ''
  }

  private init(cnp: string): void {
    if (cnp.length !== 13) {
      this._isValid = false
    } else {
      this._cnpArray = cnp
        .split('')
        .map((x: string) => {
          return parseInt(x, 10)
        })
        .filter((x: number) => !Number.isNaN(x))

      this._isValid = this.validateCnp()
    }
  }

  private validateCnp(): boolean {
    this.setYear()
    this.setMonth()
    this.setDay()
    this.setCounty()

    return this.checkDate() && this.checkCounty() && this.checkHash()
  }

  private checkDate(): boolean {
    const format = 'YYYY-MM-DD'
    const date = moment(this.dateInput(), format, true)
    const min = moment('1800-01-01', format)
    const max = moment('2099-12-31', format)
    return date.isValid() && date.isBetween(min, max)
  }

  private checkCounty(): boolean {
    return countyCode.hasOwnProperty(this._cc)
  }

  private checkHash(): boolean {
    let hashSum = 0

    for (let i = 0; i < 12; i++) {
      hashSum += this._cnpArray[i] * controlKey[i]
    }

    hashSum = hashSum % 11
    if (hashSum === 10) {
      hashSum = 1
    }

    return hashSum === this._cnpArray[12]
  }

  private setYear(): void {
    this._year = 0
    const year = this._cnpArray[1] * 10 + this._cnpArray[2]

    switch (this._cnpArray[0]) {
      // romanian citizen born between 1900.01.01 and 1999.12.31
      case 1:
      case 2:
        this._year = year + 1900
        break
      // romanian citizen born between 1800.01.01 and 1899.12.31
      case 3:
      case 4:
        this._year = year + 1800
        break
      // romanian citizen born between 2000.01.01 and 2099.12.31
      case 5:
      case 6:
        this._year = year + 2000
        break
      // residents (7&8) && people with foreign citizenship (9)
      case 7:
      case 8:
      case 9:
        this._year = year + 2000
        if (year > +moment().format('YY')) {
          this._year -= 100
        }

        break
    }
  }

  private setMonth(): void {
    this._month = `${this._cnpArray[3]}${this._cnpArray[4]}`
  }

  private setDay(): void {
    this._day = `${this._cnpArray[5]}${this._cnpArray[6]}`
  }

  private setCounty(): void {
    this._cc = `${this._cnpArray[7]}${this._cnpArray[8]}`
  }

  private dateInput(): string {
    return `${this._year}-${this._month}-${this._day}`
  }
}
