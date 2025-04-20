# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
if MeetingRoom.exists?
  puts "✅ Seed skipped: Meeting rooms already exist."
else
  puts "🌱 Seeding meeting rooms..."

  MeetingRoom.create!([
    { name: "Room Territory 1", description: "Small room" },
    { name: "Room Territory 2", description: "Small room" },
    { name: "Meeting Room 1", description: "Small room" },
    { name: "Meeting Room 2", description: "Small room" },
    { name: "All Nighter", description: "Small room" },
    { name: "Global Room", description: "Large room" },
  ])

  puts "✅ Seeding completed: Meeting rooms created."
end