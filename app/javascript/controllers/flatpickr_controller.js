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
        date => date.getDay() === 0 || date.getDay() === 6 // ปิดเสาร์-อาทิตย์
      ],
      position: "auto center",
      onChange: this.loadRooms.bind(this)
    })

    // ซ่อน/แสดง Custom Reason
    const reasonSelect = document.querySelector("#booking-reason")
    const customContainer = document.querySelector("#custom-reason-container")
    if (reasonSelect) {
      reasonSelect.addEventListener("change", () => {
        customContainer.classList.toggle("hidden", reasonSelect.value !== "Other")
      })
    }

    // ตรวจสอบอีเมลก่อนส่งฟอร์ม
    const form = this.element.closest("form")
    if (form) {
      form.addEventListener("submit", e => {
        const emailInput = document.querySelector("#booking-email")
        const email = emailInput.value.trim()
        if (!email.endsWith("@odds.team")) {
          e.preventDefault()
          alert("You are not authorized to book. Your email must end with @odds.team.")
        }
      })
    }
  }

  async loadRooms(_, dateStr) {
    console.log("📆 Selected date:", dateStr)

    try {
      const response = await fetch(`/bookings/available_rooms?date=${dateStr}`)
      const rooms = await response.json()

      const section = document.querySelector("#room-section")
      const list = document.querySelector("#room-list")
      if (section) section.classList.remove("hidden")

        const showReasonAndEmailSection = () => {
          const value = document.querySelector("#selected-time-slot").value
          if (value) {
            document.querySelector("#reason-section")?.classList.remove("hidden")
            document.querySelector("#email-section")?.classList.remove("hidden")
          }
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

        document.querySelectorAll(".room-card").forEach(card => {
          card.addEventListener("click", () => {
            document.querySelectorAll(".room-card").forEach(el =>
              el.classList.remove("ring", "ring-4", "ring-blue-500")
            )
            card.classList.add("ring", "ring-4", "ring-blue-500")
            document.querySelector("#selected-room-id").value = card.dataset.roomId

            const timeSection = document.querySelector("#time-section")
            if (timeSection) timeSection.classList.remove("hidden")
          })
        })

        // ✅ แท็บเลือกเวลา: ช่วงเวลา / รายชั่วโมง
        document.querySelectorAll(".tab-button").forEach(btn => {
          btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-button").forEach(b =>
              b.classList.remove("active-tab")
            )
            btn.classList.add("active-tab")

            const tab = btn.dataset.tab
            document.querySelectorAll(".tab-content").forEach(c =>
              c.classList.add("hidden")
            )
            document.querySelector(`#${tab}-tab`).classList.remove("hidden")

            // ล้าง selection ของฝั่งตรงข้าม
            const selectedSlot = document.querySelector("#selected-time-slot")
            if (tab === "slot") {
              document.querySelectorAll(".hour-option").forEach(b =>
                b.classList.remove("bg-blue-500", "text-white")
              )
              selectedSlot.value = ""
            } else if (tab === "hourly") {
              document.querySelectorAll(".slot-option").forEach(b =>
                b.classList.remove("bg-blue-500", "text-white")
              )
              selectedSlot.value = ""
            }
          })
        })

        // ✅ เลือกช่วงเวลาแบบ toggle
        document.querySelectorAll(".slot-option").forEach(button => {
          button.addEventListener("click", () => {
            const isActive = button.classList.contains("bg-blue-500")
            document.querySelectorAll(".slot-option").forEach(b =>
              b.classList.remove("bg-blue-500", "text-white")
            )
            if (!isActive) {
              button.classList.add("bg-blue-500", "text-white")
              document.querySelector("#selected-time-slot").value = button.dataset.slot
              showReasonAndEmailSection()
            } else {
              document.querySelector("#selected-time-slot").value = ""
            }
          })
        })

        // ✅ เลือกเวลารายชั่วโมง (เลือกหลายชั่วโมงได้)
        document.querySelectorAll(".hour-option").forEach(button => {
          button.addEventListener("click", () => {
            button.classList.toggle("bg-blue-500")
            button.classList.toggle("text-white")

            const selected = Array.from(document.querySelectorAll(".hour-option.bg-blue-500"))
              .map(btn => btn.dataset.hour)

            document.querySelector("#selected-time-slot").value = selected.join(", ")
            showReasonAndEmailSection()
          })
        })
        // ✅ เมื่อเลือกห้อง
document.querySelectorAll(".room-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".room-card").forEach(el =>
      el.classList.remove("ring", "ring-4", "ring-blue-500")
    )
    card.classList.add("ring", "ring-4", "ring-blue-500")
    document.querySelector("#selected-room-id").value = card.dataset.roomId

    const timeSection = document.querySelector("#time-section")
    if (timeSection) timeSection.classList.remove("hidden")

    // ✅ แสดงปุ่ม Submit พร้อม Reason และ Email
    document.querySelector("#reason-section")?.classList.remove("hidden")
    document.querySelector("#email-section")?.classList.remove("hidden")
    document.querySelector("#submit-section")?.classList.remove("hidden")

    // ✅ ตรวจสอบ Reason & Email เพื่อเปิด/ปิดปุ่ม
    const reasonSelect = document.querySelector("#booking-reason")
    const emailInput = document.querySelector("#booking-email")
    const submitButton = document.querySelector("#submit-button")

    function validateForm() {
      const emailValid = emailInput.value.trim().endsWith("@odds.team")
      const reasonValid = reasonSelect.value && reasonSelect.value.trim() !== ""
      submitButton.disabled = !(emailValid && reasonValid)
    }

    // ถ้าผู้ใช้เปลี่ยนค่า reason หรือ email ให้เช็คทุกครั้ง
    reasonSelect.addEventListener("change", validateForm)
    emailInput.addEventListener("input", validateForm)

    // เรียกตรวจสอบครั้งแรก
    validateForm()
  })
})

      }
    } catch (e) {
      console.error("❌ Error loading rooms:", e)
    }
  }
}
