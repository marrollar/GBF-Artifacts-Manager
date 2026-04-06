import { storageProxy } from "./StorageProxy";

/** Handles the processing of raw data into a format that can be stored for later */
class DataProcessor {
  static GetNumberAfterString(
    inputString: string,
    searchString: string,
    debug: boolean = false,
  ) {
    const locationOffsetStart = inputString.indexOf(searchString);
    if (locationOffsetStart < 0) {
      return "0";
    }
    const locationOffset = locationOffsetStart + searchString.length;
    inputString = inputString.substring(locationOffset); // Trims front of string to start at the number
    let parsedNumber = "";
    for (let i = 0; i < inputString.length; i++) {
      let c = inputString[i];
      if (debug)
        console.log(`Current char: ${c} current number: ${parsedNumber}`);
      if (c >= "0" && c <= "9") {
        parsedNumber += c;
      } else if (c == ",") continue;
      else if (parsedNumber.length > 0) {
        break;
      }
    }
    if (parsedNumber.length == 0) {
      parsedNumber = "0";
    }
    return parsedNumber;
  }

  /**
   * Converts an item's item_kind into the string for that item type
   * - This is the prefix that appears on some itemIds in this extension
   * - This must be done because some item IDs have overlap across item types
   */
  static itemKindToString(item_kind: number): string {
    switch (item_kind) {
      case 4: // Stamina / berries
        return "stam";
      case 9: // Crystal
        return "stam";
      case 10: // Normal items that go in your item inventory (usually)
        // No itemTypeString
        return "";
      case 55: // Ticket items like gold gifts or astra boxes
        return "box";
      case 73: // Rings + Earrings
        return "emp";
      case 82: // The gold and silver badges from event raids
        return "medal";
      case 88: // Plus Marks
        return "bonus";
      case 91: // Paladin Shields
        return "shld";
      case 93: // Manadiver pets
        return "mntr";
      // RISE OF THE BEAST ITEMS
      case 26: // Water RotB badge
      case 27: // Wind RotB badge
      case 28: // Earth RotB badge
      case 63: // Fire RotB badge
      case 85: // Golden RotB badge
        return "badge";
      case 49: // RotB four symbols pendants (Low drop number that has it's own type)
        return "";
      default:
        return "";
    }
  }

  /**
   * Stores a new entry in a stage's table. If a stage doesn't have a table yet, it constructs one
   */
  static async StoreRow(key: string, value: TableEntry) {
    console.log("%c[2.6]Storing table entry", "color:cornflowerblue;");
    // Checks if event is stored in eventList
    let eventInfo = {};
    for (let eventId in eventList) {
      if (eventList[eventId]?.EventTitle == key) {
        eventInfo = eventList[eventId];
        break;
      }
    }
    /** @type {JSON[] | null} An array containing the table before the new row is added */
    var table = await storageProxy.get(key);
    // Builds new table if it does not exist
    if (table == null) {
      console.log(
        "%c[!]Table was not found. Building new table...",
        "color:orange;",
      );
      table = new Array();
      // Creates 5 header rows for the table using data from the stage's first entry
      var defaultHead = structuredClone(defaultStageHeadRow);
      defaultHead.kills = 1;
      defaultHead.blueChest = value.blueChest;
      defaultHead.redChest = value.redChest;
      defaultHead.extraChest = value.extraChest;
      defaultHead.itemList = value.itemList;
      if (value?.difficulty) {
        defaultHead.difficultySum[value.difficulty] = 1;
      }
      defaultHead.lastIndex = 5;
      // Builds table with 5 rows containing values from first kill
      // Rows in order are stored Total, Monthly, Weekly, Daily, Timer
      for (let i = 0; i <= 4; i++) {
        table[i] = Object.assign({}, defaultHead);
      }
    } else {
      /** If the stage has data already recorded, simply adds the new row to headder rows */
      for (let i = 0; i <= 4; i++) {
        if (!table[i].hasOwnProperty("kills")) {
          table[i].kills = 0;
        }
        if (!table[i].hasOwnProperty("blueChest")) {
          table[i].blueChest = 0;
        }
        if (!table[i].hasOwnProperty("redChest")) {
          table[i].redChest = 0;
        }
        if (!table[i].hasOwnProperty("extraChest")) {
          table[i].extraChest = 0;
        }
        table[i].kills += 1;
        table[i].blueChest += value.blueChest;
        table[i].redChest += value.redChest;
        table[i].extraChest += value.extraChest;
        table[i].itemList = addItemList(table[i].itemList, value.itemList);
        if (value?.difficulty) {
          if (table[i].difficultySum.hasOwnProperty(value.difficulty))
            table[i].difficultySum[value.difficulty]++;
          else table[i].difficultySum[value.difficulty] = 1;
        }
        if (eventInfo != {} && table[i]?.extraInfo) {
          table[i].extraInfo = eventInfo;
        }
      }
    }

    /** Pops the new entry at the end of the list */
    table.push(value);
    /** Recounts table header rows to be within proper time periods */
    DataProcessor.BalanceStageData(table);
    await storageProxy.save({ [key]: table });
    console.log(
      "%c[2.7]Table entry was successfully stored",
      "color:cornflowerblue;",
    );
  }
}
