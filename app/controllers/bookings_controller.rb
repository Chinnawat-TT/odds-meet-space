class BookingsController < ApplicationController
  before_action :set_meeting_rooms, only: %i[new create]

  def new
    @booking = Booking.new
    @holidays = Holiday.pluck(:date) 
    if params[:booking_date].present? && params[:meeting_room_id].present?
   
      @booked_slots = Booking.where(booking_date: params[:booking_date], meeting_room_id: params[:meeting_room_id]).pluck(:booking_time)
    else
      
      @booked_slots = []
    end
  end
  
  def create
    reason = params[:booking][:reason]
    custom_reason = params[:custom_reason]
    final_reason = reason == "Other" ? custom_reason : reason
  
    @booking = Booking.new(booking_params.merge(reason: final_reason))
  
    if @booking.save
      BookingMailer.confirmation_email(@booking).deliver_later
      redirect_to @booking, notice: "Booking created successfully."

    else
      flash.now[:alert] = "Failed to create booking."
      render :new
    end
  end
  
  
  
  def show
    @booking = Booking.find(params[:id])
  end

  def available_rooms
    date = params[:date]

    # logic ตรวจว่าเป็นวันหยุดหรือเปล่าก็ได้
    if date.blank?
      render json: { error: "Date required" }, status: :unprocessable_entity
    else
      rooms = MeetingRoom.all
      render json: rooms
    end
  end

  def unavailable_times
    date = params[:date]
    room_id = params[:room_id]
  
    bookings = Booking.where(meeting_room_id: room_id, booking_date: date)
    times = bookings.pluck(:booking_time) 
  
    render json: { unavailable: times }
  end
  

  private

  def set_meeting_rooms
    @meeting_rooms = MeetingRoom.all
  end
  
  def booking_params
    permitted = params.require(:booking)
    .permit(:meeting_room_id, 
      :booking_date, 
      :booking_time, 
      :reason, 
      :email, 
      hourly_times: [])
    
 
    if permitted[:booking_time] == "hourly" && permitted[:hourly_times]
      permitted[:booking_time] = permitted[:hourly_times].join(", ")
    end
  
    permitted.except(:hourly_times)
  end
  
  
end
