export interface ILocation {
    id: string,
    name: string,
    slogan: string,
    image: string, // client
    information: string,
    prime_spot: string,
    visit_address: {
    address: string,
        lat: string,
        lng: string
    },
    updatedDate: string,
    nearest_city: string,
    correspondence_address: string,
    board_rental: string,
    wetsuit_rental: string,
    session_video_price: string,
    session_photo_price: string,
    wave_specifications: string,
    url: string,
    reflink: string,
    board_included: boolean,
    wetsuit_included: boolean,
    book_now_title: string,
    book_now_subtitle: string,
    book_now_button_caption: string,
    book_now: string,
    waves: ILocationWave[],
    nearby_natural_spots: [{
        name: string,
        address: {
            address: string,
            lat: string,
            lng: string
        },
        external_link: string
    }],
    post: {
        title: string,
        name: string,
        id: string,
        content: string
    }
}

export interface ILocationWave {
    wave_name: string,
    status: string,
    commissioning_date: string,
    maintenance: string,
    tech_type: string,
    tech_energy_consumption: string,
    wave_difficulty: string,
    wave_shape: string,
    wave_height: string,
    wave_length: string,
    wave_width: string,
    wave_direction: string,
    wave_speed: string,
    ride_duration: string,
    wave_pump: string,
    wave_frequency: string,
    waves_per_hour: string,
    wave_product_name: string, //client
    wave_product_url: string, //client
    wave_product_test_location: string, //client
    wave_manufacturer_name: string, //client
    wave_production_method_type: string, //client
    wave_indoor: boolean, // client
    customers_per_hour: string,
    customers_per_wave: string,
    total_time_on_board: string,
    net_surf_price: string,
    price_adult_high: string,
    price_adult_low: string,
    price_child_high: string,
    price_child_low: string,
    water_temp: string,
    water_type: string,
    wetsuite_type: string, // client
    water_quality: string,
    recommended_wetsuite: [string],
    wave_system: string,
    minimum_age: string,
    minimum_surfer_length: string, // client
    passes: string
}