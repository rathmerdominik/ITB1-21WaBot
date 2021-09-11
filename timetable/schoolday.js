class Schoolday {
  day;
  oddWeek = null; //If oddWeek is null, the schoolday is valid for every week
  firstBlock;
  secondBlock;
  thirdBlock;
  fourthBlock;
  currentBlock;
  message;

  constructor(day, oddWeek, firstBlock, secondBlock, thirdBlock, fourthBlock) {
    this.day = day;
    this.oddWeek = oddWeek;
    this.firstBlock = firstBlock;
    this.secondBlock = secondBlock;
    this.thirdBlock = thirdBlock;
    this.fourthBlock = fourthBlock;
    this.getCurrentBlock();
    this.message =
      " 1.Block: " +
      this.firstBlock +
      "\n 2.Block: " +
      this.secondBlock +
      "\n 3.Block: " +
      this.thirdBlock +
      "\n 4.Block: " +
      this.fourthBlock +
      "\n Aktueller Block:" +
      this.currentBlock;
  }

  getCurrentBlock() {
    //Get the Timeactual Lesson
    var day = new Date();
    var hour = day.getHours();
    var minutes = day.getMinutes();
    switch (hour) {
      case 8:
        this.currentBlock = this.firstBlock;
        break;
      case 9:
        if (minutes < 30) {
          this.currentBlock = this.firstBlock;
        } else if (minutes < 50) {
          this.currentBlock = "Pause";
        } else {
          this.currentBlock = this.secondsBlock;
        }
        break;
      case 10:
        this.currentBlock = this.secondBlock;
        break;
      case 11:
        if (minutes < 20) {
          this.currentBlock = this.secondBlock;
        } else if (minutes < 40) {
          this.currentBlock = "Pause";
        } else {
          this.currentBlock = this.thirdBlock;
        }
        break;
      case 12:
        this.currentBlock = this.thirdBlock;
        break;
      case 13:
        if (minutes < 10) {
          this.currentBlock = this.thirdBlock;
        } else if (minutes < 30) {
          this.currentBlock = "Pause";
        } else {
          this.currentBlock = this.fourthBlock;
        }
        break;
      case 14:
        this.currentBlock = this.fourthBlock;
        break;
      default:
        this.currentBlock = "Schulfrei";
        break;
    }
  }
}


export default Schoolday;
