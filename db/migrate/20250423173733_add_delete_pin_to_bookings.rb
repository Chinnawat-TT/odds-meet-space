class AddDeletePinToBookings < ActiveRecord::Migration[7.1]
  def change
    add_column :bookings, :delete_pin, :string
  end
end
