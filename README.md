# CNP - romanian personal identification number validator

## (CNP - validator cod numeric personal)

### How to install?

```
npm i --save romanian-personal-identity-code-validator
```

### How to use it?

```js
import { CNP } from 'romanian-personal-identity-code-validator';

let cnp = new CNP('123'); 
// or use a setter
cnp.cnp = '5110102441483';

if (cnp.isValid()) {
  // extract information from an valid CNP
  console.log(cnp.getBirthDate());           // default format 'YYYY-MM-DD'
  console.log(cnp.getBirthDate('YYYY'));     // or only the year
  console.log(cnp.getBirthPlace());
  console.log(cnp.getGender());              // default male | female
  console.log(cnp.getGender('M', 'F'));      // or set a custom value M | F
  console.log(cnp.getAgeInYears());
  console.log(cnp.hasIdentityCard());        // if the age is grater than 14 years
  console.log(cnp.getSerialNumberFromCNP());
}
```

### How to run tests
```js
npm test
```

### License

This package is licensed under the [MIT](http://opensource.org/licenses/MIT) license.
