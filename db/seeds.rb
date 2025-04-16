# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
MeetingRoom.create!([
    { name: "Meeting Room A", description: "Small meeting room" },
    { name: "Meeting Room B", description: "Small meeting room" },
    { name: "Meeting Room C", description: "Small meeting room" },
    { name: "Meeting Room D", description: "Small meeting room" },
    { name: "Meeting Room E", description: "Small meeting room" },
    { name: "Meeting Room F", description: "Large meeting room" },
    { name: "Meeting Room G", description: "Large meeting room" }
  ])