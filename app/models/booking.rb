class Booking < ApplicationRecord
  belongs_to :meeting_room

  validates :booking_date, :booking_time, :reason, :email, presence: true
  validates :email, format: { with: /\A[^@\s]+@odds\.team\z/, message: "must be a valid @odds.team email" }
  validates :status, inclusion: { in: ["pending", "confirmed", "cancelled"] }
end
