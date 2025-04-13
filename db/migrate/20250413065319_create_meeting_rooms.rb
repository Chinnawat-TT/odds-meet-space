class CreateMeetingRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :meeting_rooms do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end
