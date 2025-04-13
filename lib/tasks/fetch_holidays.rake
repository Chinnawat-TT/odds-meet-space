namespace :holidays do
    desc "Fetch and sync Thai public holidays from MyHora"
    task sync: :environment do
      puts "Syncing holidays from MyHora..."
      HolidayFetcher.sync!
      puts "Done!"
    end
  end