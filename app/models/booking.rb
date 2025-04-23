# app/models/booking.rb
class Booking < ApplicationRecord
  belongs_to :meeting_room

  validates :meeting_room_id, :booking_date, :booking_time, :email, presence: true
  # validates :email, format: { with: /\A[\w+\-.]+@odds\.team\z/, message: "Access denied for this email" }
  validate :not_in_the_past
  validate :not_on_holiday
  validate :unique_slot

  def not_in_the_past
    errors.add(:booking_date, "cannot be in the past") if booking_date && booking_date < Date.today
  end

  def not_on_holiday
    if Holiday.exists?(date: booking_date)
      errors.add(:booking_date, "is a public holiday and cannot be booked")
    end
  end

  def unique_slot
    if Booking.exists?(meeting_room_id: meeting_room_id, booking_date: booking_date, booking_time: booking_time)
      errors.add(:booking_time, "has already been booked for this room")
    end
  end
end
