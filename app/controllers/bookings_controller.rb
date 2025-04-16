class BookingsController < ApplicationController
  before_action :set_meeting_rooms, only: %i[new create]

  def new
    @booking = Booking.new
    # ตรวจสอบการกรอกวันที่และห้องประชุมก่อนที่จะดึงข้อมูล
    if params[:booking_date].present? && params[:meeting_room_id].present?
      # ดึงเวลาที่จองแล้วในวันและห้องที่เลือก
      @booked_slots = Booking.where(booking_date: params[:booking_date], meeting_room_id: params[:meeting_room_id]).pluck(:booking_time)
    else
      # ถ้าไม่มีการเลือก, ให้เริ่มต้นเป็น array ว่าง
      @booked_slots = []
    end
  end
  
  def create
    @booking = Booking.new(booking_params)
  
    Rails.logger.debug "🎯 Params: #{booking_params.inspect}"
    Rails.logger.debug "🎯 Valid?: #{@booking.valid?}"
    Rails.logger.debug "🎯 Errors: #{@booking.errors.full_messages}" if @booking.invalid?
  
    if @booking.save
      # BookingMailer.confirmation_email(@booking).deliver_later
      redirect_to booking_path(@booking), notice: "Booking successful!"
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  
  def show
    @booking = Booking.find(params[:id])
  end

  private

  def set_meeting_rooms
    @meeting_rooms = MeetingRoom.all
  end
  
  def booking_params
    permitted = params.require(:booking).permit(:meeting_room_id, :booking_date, :booking_time, :reason, :email, hourly_times: [])
    
    # ถ้า booking_time คือ hourly, ให้รวม hourly_times เป็น string
    if permitted[:booking_time] == "hourly" && permitted[:hourly_times]
      permitted[:booking_time] = permitted[:hourly_times].join(", ")
    end
  
    permitted.except(:hourly_times) # ตัด hourly_times ทิ้งจาก params เพราะเรา merge ไปแล้ว
  end
  
  
end
