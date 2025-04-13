class MeetingRoom < ApplicationRecord
    has_many :bookings, dependent: :destroy
  end
  
