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
      ],
      position: "auto center",
      onChange: this.loadRooms.bind(this),

    })
    
  }
  async loadRooms(selectedDates, dateStr) {
    console.log("📆 Selected date:", dateStr)
  
    try {
      const response = await fetch(`/bookings/available_rooms?date=${dateStr}`)
      const rooms = await response.json()
  
      const section = document.querySelector("#room-section")
      const list = document.querySelector("#room-list")
  
      if (section) section.classList.remove("hidden") // แสดง block ห้อง
  
      if (list) {
        list.innerHTML = rooms.map(room => `
          <div class="w-full md:w-[45%] border p-4 rounded-lg shadow bg-white hover:bg-gray-50 transition">
            <strong class="text-lg">${room.name}</strong>
            <p class="text-sm text-gray-600 mt-1">${room.description}</p>
          </div>
        `).join("")
      }
      if (list) {
        list.innerHTML = rooms.map(room => `
          <div 
            class="room-card w-full md:w-[45%] border p-4 rounded-lg shadow bg-white hover:bg-gray-50 cursor-pointer transition"
            data-room-id="${room.id}"
          >
            <strong class="text-lg">${room.name}</strong>
            <p class="text-sm text-gray-600 mt-1">${room.description}</p>
          </div>
        `).join("")
      
        // เมื่อคลิกเลือกห้อง
        const cards = list.querySelectorAll(".room-card")
        cards.forEach(card => {
          card.addEventListener("click", () => {
            // ลบ active จากทั้งหมดก่อน
            cards.forEach(c => c.classList.remove("ring", "ring-blue-500"))
      
            // เพิ่ม active กับที่คลิก
            card.classList.add("ring", "ring-blue-500")
      
            // ใส่ค่า id ลง hidden input
            const selectedId = card.dataset.roomId
            document.querySelector("#selected-room-id").value = selectedId
          })
        })
      }
  
    } catch (e) {
      console.error("❌ Error loading rooms:", e)
    }
  }
  
}