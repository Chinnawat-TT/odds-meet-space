Rails.application.routes.draw do
  get "bookings/available_rooms", to: "bookings#available_rooms"
  root "bookings#new"
  resources :bookings, only: [:new, :create, :show]

end
