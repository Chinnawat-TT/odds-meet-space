class CreateBookings < ActiveRecord::Migration[7.1]
  def change
    create_table :bookings do |t|
      t.references :meeting_room, null: false, foreign_key: true
      t.date :booking_date
      t.string :booking_time
      t.text :reason
      t.string :email
      t.string :status

      t.timestamps
    end
    add_index :bookings, [:meeting_room_id, :booking_date, :booking_time], unique: true
  end
end
