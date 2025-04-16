Rails.application.routes.draw do
  root "bookings#new"
  resources :bookings, only: [:new, :create, :show]

end
