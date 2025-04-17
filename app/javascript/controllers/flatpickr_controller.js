import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr"

export default class extends Controller {
  static values = {
    holidays: String 
  }
  connect() {
    let disabledDates = []

    if (this.hasHolidaysValue) {
      try {
        disabledDates = JSON.parse(this.holidaysValue)
      } catch (e) {
        console.error("❌ Failed to parse holidays JSON:", e)
      }
    }
    console.log("✅ Flatpickr controller connected")
    flatpickr(this.element, {
      dateFormat: "Y-m-d",
      minDate: "today",
      disableMobile: true, 
      disable: [
        ...disabledDates, 
        function(date) {
          return (date.getDay() === 0 || date.getDay() === 6);
        }
      ]
    })
  }
}