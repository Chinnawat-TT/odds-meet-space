class Holiday < ApplicationRecord
  validates :date, presence: true, uniqueness: true
  validates :name, presence: true
end

module HolidayHelper
  def self.holiday?(date)
    Holiday.exists?(date: date)
  end
end