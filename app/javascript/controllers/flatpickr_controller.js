import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr"

export default class extends Controller {
  connect() {
    console.log("✅ Flatpickr controller connected")
    flatpickr(this.element, {
      dateFormat: "Y-m-d",
      minDate: "today",
      disableMobile: true // ✅ อันนี้สำคัญมากสำหรับ mobile
    })
  }
}