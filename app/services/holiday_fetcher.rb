# app/services/holiday_fetcher.rb
require 'net/http'
require 'json'

class HolidayFetcher
  MYHORA_API_URL = "https://www.myhora.com/calendar/ical/holiday.aspx?2568.json"

  def self.sync!
    response = Net::HTTP.get(URI(MYHORA_API_URL))
    raw_data = JSON.parse(response)

    events = raw_data.dig("VCALENDAR", 0, "VEVENT")
    return unless events.present?

    events.each do |event|
      date_str = event["DTSTART;VALUE=DATE"]
      name = event["SUMMARY"]

      next unless date_str && name

      begin
        date = Date.strptime(date_str, "%Y%m%d")
        Holiday.find_or_create_by(date: date) do |holiday|
          holiday.name = name
        end
      rescue ArgumentError => e
        Rails.logger.error("Invalid date format: #{date_str}")
      end
    end
  end
end
