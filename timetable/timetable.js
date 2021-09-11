import Schoolday from "./schoolday.js";

class TimeTable {
  static getTimeTable() {
    // Returns TimeTable String
    /*0 = Sunday
    1 = Monday
    2 = Tuesday
    3 = wednesDay
    4 = Thursday
    5 = Friday
    6 = Saturday*/

    var oddWeek = null;

    var firstSchooldayObj = new Schoolday(5, null, "SUD", "PGL", "EVP", "GID");  //Notiz: Hier werden die Schultage angelegt !
    var secondSchooldayObj = new Schoolday(4, false, "SUD", "REL", "SPG", "DEK");

    var schooldayList = [firstSchooldayObj, secondSchooldayObj];

    var calenderWeek = this.getCalenderWeek();
    var currentDay = new Date().getDay();
    var todaySchoolday = null;
    var noSchoolMsg = "Today is no School!";

    if (calenderWeek % 2 == 0) {
      oddWeek = false;
    } else {
      oddWeek = true;
    }

    for (var i in schooldayList) {
      switch (schooldayList[i].oddWeek) {
        case true:
          if (schooldayList[i].day == currentDay && oddWeek) {
            todaySchoolday = schooldayList[i];
          }
          break;
        case false:
          if (schooldayList[i].day == currentDay && !oddWeek) {
            todaySchoolday = schooldayList[i];
          }
          break;
        default:
          if (schooldayList[i].day == currentDay) {
            todaySchoolday = schooldayList[i];
          }
          break;
      }

      if (todaySchoolday != null) {
        break;
      }
    }

  
    if (todaySchoolday != null) {
      return todaySchoolday.message;
    } else {
      return noSchoolMsg;
    }

   
  }

  static getCalenderWeek() {
    //Returns the actual CalenderWeek

    var firstWeekDay = this.getFirstWeekDay(0);

    var firstWeekMonday;

    if (firstWeekDay.getDay() == 0) {
      firstWeekMonday = firstWeekDay;
    } else {
      var firstWeekMonday = this.setToMonday(firstWeekDay);
    }

    var calenderWeek = Math.ceil(this.calculateCalenderWeek(firstWeekMonday));

    return calenderWeek;
  }

  checkOddWeek(calenderWeek) {
    dividedWeek = calenderWeek % 2;

    if (dividedWeek == 0) {
      return false;
    } else {
      return true;
    }
  }

  static setToMonday(day) {
    //Searches the monday in the week in which is "day"
    var dayType = day.getDay();
    dayType++;
    var dayInMonth = day.getDate() - dayType;
    var monday = new Date(day.getFullYear(), day.getMonth(), dayInMonth);

    return monday;
  }

  static calculateCalenderWeek(firstDay) {
    //Calculates the calenderweek which starts with "firstday"
    const milPerWeek = 604800000;
    var timeNow = new Date();
    var timeStartYear = firstDay.getTime();
    var yearTime = timeNow - timeStartYear;
    var calenderWeek = yearTime / milPerWeek;
    return calenderWeek;
  }

  static getFirstWeekDay(firstWeekDay) {
    //Calculates the first day of the Year
    firstWeekDay++;
    var actualDate = new Date();
    var tempDate = new Date(actualDate.getFullYear(), 0, firstWeekDay);

    if (tempDate.getDay() < 4 && tempDate.getDay() != 0) {
      return tempDate;
    } else {
      return this.getFirstWeekDay(firstWeekDay);
    }
  }
}

export default TimeTable;
