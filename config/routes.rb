Rails.application.routes.draw do
  get "bookings/available_rooms", to: "bookings#available_rooms"
  get 'bookings/unavailable_times', to: 'bookings#unavailable_times'
  get 'bookings/lookup', to: 'bookings#lookup_form'
  post 'bookings/lookup', to: 'bookings#lookup_result'
  delete 'bookings/:id', to: 'bookings#destroy', as: 'delete_booking'
  root "bookings#new"
  resources :bookings, only: [:new, :create, :show]
  resources :bookings
end
