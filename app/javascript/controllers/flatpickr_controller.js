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
          card.addEventListener("click", () => selectRoom(card))
        })

        function selectRoom(element) {
          // ลบ active จากทุกห้อง
          document.querySelectorAll(".room-card").forEach(el => {
            el.classList.remove("ring", "ring-4", "ring-blue-500")
          })
        
          // เพิ่ม active กับที่เลือก
          element.classList.add("ring", "ring-4", "ring-blue-500")
        
          // อัปเดต hidden input
          const selectedId = element.dataset.roomId
          document.querySelector("#selected-room-id").value = selectedId
        
       
        }

        //   const timeSection = document.querySelector("#time-section")
        //   const timeList = document.querySelector("#time-slots")
        
        //   if (timeSection) timeSection.classList.remove("hidden")
        
        //   const slots = [
        //     "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
        //     "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"
        //   ]
        
        //   timeList.innerHTML = slots.map(slot => `
        //     <div 
        //       class="time-slot px-4 py-2 bg-gray-100 hover:bg-blue-100 rounded cursor-pointer"
        //       data-time-slot="${slot}"
        //     >
        //       ${slot}
        //     </div>
        //   `).join("")
        
        //   // handle slot selection
        //   document.querySelectorAll(".time-slot").forEach(slot => {
        //     slot.addEventListener("click", () => {
        //       document.querySelectorAll(".time-slot").forEach(el => {
        //         el.classList.remove("bg-blue-200")
        //       })
        //       slot.classList.add("bg-blue-200")
        //       document.querySelector("#selected-time-slot").value = slot.dataset.timeSlot
        //     })
        //   })
        // }
        // แสดง time section
const timeSection = document.querySelector("#time-section")
if (timeSection) timeSection.classList.remove("hidden")

// จัดการปุ่มแท็บ
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    // เปลี่ยนแอคทีฟแท็บ
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active-tab"))
    btn.classList.add("active-tab")

    const tab = btn.dataset.tab

    // ซ่อน/แสดงเนื้อหาแท็บ
    document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"))
    document.querySelector(`#${tab}-tab`).classList.remove("hidden")

    // 🎯 เคลียร์ค่า selection อีกฝั่ง
    const selectedSlot = document.querySelector("#selected-time-slot")
    if (tab === "slot") {
      // ล้างรายชั่วโมง
      document.querySelectorAll(".hour-option").forEach(b => {
        b.classList.remove("bg-blue-500", "text-white")
      })
      selectedSlot.value = ""
    } else if (tab === "hourly") {
      // ล้างช่วงเวลา
      document.querySelectorAll(".slot-option").forEach(b => {
        b.classList.remove("bg-blue-500", "text-white")
      })
      selectedSlot.value = ""
    }
  })
})


// ✅ เลือกช่วงเวลา (ให้ toggle ได้เหมือนรายชั่วโมง)
document.querySelectorAll(".slot-option").forEach(button => {
  button.addEventListener("click", () => {
    const isActive = button.classList.contains("bg-blue-500")

    // ลบ active จากทุกปุ่มก่อน
    document.querySelectorAll(".slot-option").forEach(b => {
      b.classList.remove("bg-blue-500", "text-white")
    })

    if (!isActive) {
      // ถ้ายังไม่ active ก็เพิ่ม class และตั้งค่า value
      button.classList.add("bg-blue-500", "text-white")
      const value = button.dataset.slot
      document.querySelector("#selected-time-slot").value = value
    } else {
      // ถ้าเป็น active อยู่แล้ว = toggle ออก
      document.querySelector("#selected-time-slot").value = ""
    }
  })
})


// เลือกรายชั่วโมง
document.querySelectorAll(".hour-option").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("bg-blue-500")
    button.classList.toggle("text-white")

    // เก็บเวลาที่เลือกทั้งหมด (เช่น ["09:00", "10:00"])
    const selected = Array.from(document.querySelectorAll(".hour-option.bg-blue-500"))
      .map(btn => btn.dataset.hour)

    document.querySelector("#selected-time-slot").value = selected.join(", ")
  })
})

        
      }
  
    } catch (e) {
      console.error("❌ Error loading rooms:", e)
    }
  }
  
}