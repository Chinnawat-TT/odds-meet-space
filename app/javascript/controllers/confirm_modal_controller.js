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
    fetch(this.currentDeleteUrl, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content,
        "Accept": "text/vnd.turbo-stream.html"
      }
    }).then(response => {
      if (response.ok) {
       
        const bookingElement = document.querySelector(`[data-confirm-modal-url-value="${this.currentDeleteUrl}"]`)
        if (bookingElement) {
          bookingElement.remove()
        }
        this.close()
      } else {
        alert("delete failed")
        this.close()
      }
    })
  }
  
}
