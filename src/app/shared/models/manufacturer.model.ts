export interface INearbyNaturalSpot {
  nearbyNaturalSpotName: string;
  nearbyNaturalSpotLocation: string; // IWaveLocation.key
  nearbyNaturalSpotAddress: any;
}

export interface IManufacturer {
  manufacturerKey: string;
  manufacturerName: string;
  manufacturerExcerpt: string;
  manufacturerURL: string;
  manufacturerSubcontractorName: string;
  manufacturerAdditional: string;
  manufacturerAbout: string;
  manufacturerLastUpdated: string;
}

export interface IWaveProductionMethod {
  waveProductionMethodKey: string;
  waveProductionMethodName: string;
  waveProductionMethodType: string; // Rolling | Standing | River
  waveProductionMethodExcerpt: string;
  waveProductionMethodURL: string;
  waveProductionMethodAdditional: string;
  waveProductionMethodAbout: string;
  waveProductionMethodLastUpdated: string;
}

export interface IWaveSystemProduct {
  waveSystemProductKey: string;
  waveSystemProductManufacturer: string; // IManufacturer.key
  waveSystemProductProductionMethod: string; // IWaveProductionMethod.key
  waveSystemProductName: string;
  waveSystemProductExcerpt: string;
  waveSystemProductURL: string;
  waveSystemProductTestLocationURL: string;
  waveSystemProductAdditional: string;
  waveSystemProductAbout: string;
  waveSystemProductLastUpdated: string;
}

export interface INearbyNaturalWaveSpot {
  nearbyNaturalWaveSpotKey: string;
  nearbyNaturalWaveSpotName: string;
  nearbyNaturalWaveSpotAddress: string;
  nearbyNaturalWaveSpotStormriderOrWannasurfLink: string;
}

export interface IPass {
  passKey: string;
  passName: string;
  passValidFor: Date;
  passTotalPrice: number;
  passCalculatedNettPricePerMinute: number;
  passPassExplanationCalculation: string;
}

export interface IMaintenance {
  maintenanceKey: string;
  maintenanceStartDatum: Date;
  maintenanceStopDatum: Date;
}

export interface IWaveLocation {
  waveLocationKey: string;
  waveLocationAbout: string;
  waveLocationName: string;
  waveLocationSlogan: string;
  waveLocationAdditionalInfo: string;
  waveLocationPrimeSpot: string;
  waveLocationWebsite: string;
  waveLocationReferralLink: string;
  waveLocationBookingTitle: string;
  waveLocationBookingSubtitle: string;
  waveLocationBookingButtonText: string;
  waveLocationVisitAddress: IAddress;
  waveLocationB2BAddress: string;
  waveLocationNearestCity: string;
  waveLocationDirection?: string;
}

export interface IAddress {
  address: string;
  lat: string;
  lng: string;
  zoom?: number;
  place_id?: string;
  name?: string;
  street_number?: string;
  street_name?: string;
  city?: string;
  city_short?: string;
  state?: string;
  state_short?: string;
  street_name_short?: string;
  post_code?: string;
  country?: string;
  country_short?: string;
}

export interface IWaveSpecification {
  waveSpecificationProduct: string | null; // IWaveSystemProduct.key
  waveSpecificationLocation: string; // IWaveLocation.key
  waveSpecificationName: string;
  waveSpecificationStatus: string;
  waveSpecificationCommissioningDate: string;
  waveSpecificationEnergyConsumption: string;
  waveSpecificationDifficulty: string;
  waveSpecificationMinimumSurferAge: number;
  waveSpecificationMinimumSurferLength: number;
  waveSpecificationWaveShape: string;
  waveSpecificationWaveHeight: number;
  waveSpecificationWaveDirection: string;
  waveSpecificationWaveSpeed?: number;
  waveSpecificationWaveSystem?: string;
  waveSpecificationWaveFrequency?: number; // Rolling
  waveSpecificationWaveLength?: number; // Rolling
  waveSpecificationWaveWidth?: number; // Standing | River | RollingStanding
  waveSpecificationWavePump?: number; // Standing | RollingStanding
  waveSpecificationDurationRide: number;
  waveSpecificationRidesPerHour: number;
  waveSpecificationMaxCustomersPerHour: number;
  waveSpecificationMaxCustomersPerWave: number;
  waveSpecificationPriceAdultHigh: number;
  waveSpecificationPriceAdultLow: number;
  waveSpecificationPriceChildHigh: number;
  waveSpecificationPriceChildLow: number;
  waveSpecificationWaterTemp: number;
  waveSpecificationWaterType: string;
  waveSpecificationWaterQuality: string;
  waveSpecificationBoardRentalHr: number;
  waveSpecificationWetsuitRentalHr: number;
  waveSpecificationIndoor: boolean;
  waveSpecificationVideoRecordingPriceSession: number;
  waveSpecificationPhotoPriceSession: number;
  waveSpecificationOurTestimonial: string;
  waveSpecificationRecommendedWetSuite?: any
}

export enum EWaveSpecificationStatus {
  open_all_year_round = 'open all year round',
  open_all_year_round_but_private = 'open all year round but private',
  open_only_during_summer_season = 'open only during summer season',
  maintenance = 'maintenance',
  permanently_closed = 'permanently closed',
  planned = 'planned',
  being_build = 'being build'
}

export enum EWaveDirection {
  left = 'left',
  right = 'right',
  both = 'both',
  left_or_right = 'left or right'
}
