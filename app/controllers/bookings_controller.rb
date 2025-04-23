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
  

  def lookup_form
  end

  def lookup
    if request.post?
      email = params[:email].to_s.strip.downcase
  
      if email.blank?
        flash.now[:alert] = "Please enter a valid email."
        render :lookup_form and return
      end
  
      @bookings = Booking.where("LOWER(email) = ?", email).order(date: :asc, start_time: :asc)
  
      if @bookings.any?
        render :lookup_result
      else
        flash.now[:alert] = "No bookings found for this email."
        render :lookup_form
      end
    else
      render :lookup_form
    end
  end
  
  def lookup_result
    email = params[:email]
    @bookings = Booking.where(email: email)

    if @bookings.empty?
      flash[:alert] = "No bookings found for this email."
      render :lookup_form
    else
      render :lookup_result
    end
  end

  def destroy
    @booking = Booking.find(params[:id])
    
    if @booking.delete_pin == params[:delete_pin]
      @booking.destroy
      respond_to do |format|
        format.html { redirect_to bookings_lookup_path, notice: "Booking deleted successfully." }
        format.json { head :no_content }
        format.turbo_stream { render turbo_stream: turbo_stream.remove("booking_#{@booking.id}") }
      end
    else
      respond_to do |format|
        format.html { redirect_to bookings_lookup_path, alert: "Invalid delete PIN." }
        format.json { render json: { error: "Invalid delete PIN" }, status: :unauthorized }
        format.turbo_stream { render turbo_stream: turbo_stream.replace("booking_#{@booking.id}", partial: "bookings/booking", locals: { booking: @booking, error: "Invalid delete PIN" }) }
      end
    end
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
