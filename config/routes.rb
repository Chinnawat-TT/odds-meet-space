Rails.application.routes.draw do
  get "bookings/available_rooms", to: "bookings#available_rooms"
  get 'bookings/unavailable_times', to: 'bookings#unavailable_times'
  root "bookings#new"
  resources :bookings, only: [:new, :create, :show]

end
