import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal", "content"]
  static values = {
    url: String
  }

  connect() {
    this.modal = this.modalTarget
    this.content = this.contentTarget
  }

  open(event) {
    event.preventDefault()
   
    const url = event.target.closest("[data-confirm-modal-url-value]").dataset.confirmModalUrlValue
    this.currentDeleteUrl = url

    this.modal.classList.remove("hidden")
    setTimeout(() => {
      this.modal.classList.remove("opacity-0")
      this.content.classList.remove("scale-95")
    }, 10)
  }

  close() {
    this.modal.classList.add("opacity-0")
    this.content.classList.add("scale-95")
    setTimeout(() => {
      this.modal.classList.add("hidden")
    }, 300)
  }

  confirm() {
    const bookingElement = document.querySelector(`[data-confirm-modal-url-value="${this.currentDeleteUrl}"]`)
    const deletePinInput = bookingElement.querySelector(".delete-pin-input")
    const deletePin = deletePinInput.value.trim()

    if (!deletePin) {
      alert("Please enter the delete PIN")
      return
    }

    fetch(this.currentDeleteUrl, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content,
        "Accept": "text/vnd.turbo-stream.html",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ delete_pin: deletePin })
    }).then(response => {
      if (response.ok) {
        if (bookingElement) {
          bookingElement.remove()
        }
        this.close()
      } else {
        response.json().then(data => {
          alert(data.error || "Delete failed")
        })
        this.close()
      }
    })
  }
}
