class AdminController < ApplicationController
    # ⚠️ ควรลบ route นี้ออกหลังจาก migrate เสร็จ!
    def migrate
      begin
        ActiveRecord::Base.connection.migration_context.migrate
        render plain: "✅ Migration completed successfully"
      rescue => e
        render plain: "❌ Migration failed: #{e.message}", status: 500
      end
    end
  end
  