/*
 *
 *
 *       Complete the handler logic below
 *
 *
 */

function ConvertHandler() {
  this.getNum = function(input) {
    // delete all letters and spaces.
    let cleanInput = input.replace(/[A-z]| /g, "");
    cleanInput = cleanInput.replace(",", ".");

    const doubleFractionCheck = /[\/][0-9.,]+[\/]/g;

    if (cleanInput === "") return 1;
    else if (doubleFractionCheck.test(cleanInput)) return "invalid number";

    const checkFraction = /[0-9.,]+[/][1-9.,]+/g;

    //fractional input check
    if (checkFraction.test(cleanInput)) {
      let matchedF = cleanInput.match(checkFraction);

      return eval(matchedF[0]);
    } else
      return Number.isNaN(parseFloat(input))
        ? "invalid number"
        : parseFloat(input);
  };

  this.getUnit = function(input) {
    let units = ["kg", "lbs", "km", "mi", "l", "gal"];
    // delete all non-letters
    let cleanInput = input.toLowerCase().replace(/[^A-z]/g, "");
    let res = units.includes(cleanInput) ? cleanInput : undefined;

    if (res === undefined) return "invalid unit";
    return res;
  };

  this.getReturnUnit = function(rawUnit) {
    let unitList = new Map([["km", "mi"], ["l", "gal"], ["kg", "lbs"]]);
    for (let [key, value] of unitList) {
      if (value === rawUnit) return key;
      else if (key === rawUnit) return value;
    }
    return "invalid unit";
  };

  this.spellOutUnit = function(unit) {
    let units = unit.toLowerCase();
    let obj = {
        gal: "gallons",
        l: "liters",
        lbs: "pounds",
        kg: "kilograms",
        mi: "miles",
        km: "kilometers"
      },
      result;

    for (let props in obj) {
      if (props == units) {
        result = obj[props];
      }
    }

    return result;
  };

  this.convert = function(initNum, initUnit) {
    let convertMap = {
      galTOl: 3.78541,
      lbsTOkg: 0.453592,
      miToKm: 1.60934
    };

    let value;

    switch (initUnit) {
      case "gal":
        value = initNum * convertMap.galTOl;
        break;
      case "l":
        value = initNum / convertMap.galTOl;
        break;
      case "lbs":
        value = initNum * convertMap.lbsTOkg;
        break;
      case "kg":
        value = initNum / convertMap.lbsTOkg;
        break;
      case "km":
        value = initNum / convertMap.miToKm;
        break;
      case "mi":
        value = initNum * convertMap.miToKm;
        break;
      default:
        value = "invalid number";
    }

    return Number.isNaN(value)
      ? "invalid number"
      : parseFloat(value.toFixed(3));
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    if (initNum == undefined || returnNum == undefined) {
      return "invalid number";
    } else if (returnUnit == undefined || initUnit == undefined) {
      return "invalid unit";
    } else {
      console.log(
        `${initNum} ${this.spellOutUnit(
          initUnit
        )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}.`
      );

      return `${initNum} ${this.spellOutUnit(
        initUnit
      )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}.`;
    }
  };
}

module.exports = ConvertHandler;
