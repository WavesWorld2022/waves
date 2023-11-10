import { Component, OnInit } from '@angular/core';
import {FireService} from "../../services/fire.service";
import {Subject, takeUntil} from "rxjs";
import {IWaveLocation, IWaveProductionMethod, IWaveSpecification, IWaveSystemProduct} from "../../shared/models";
import {waveSpecifications} from "../../../assets/json/wave-specifications";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  isLoading = false;
  selected = '';
  activeFilter = 'f-1';
  center: any;

  /*nav = [
    {id: 'f-1',  title: 'All', icon: 'shield-0', query: (w: any) => w},
    {id: 'f-2',  title: 'ME',  icon: 'shield-1', query: (w: any) => w},
    {id: 'f-3',  title: 'R',   icon: 'shield-2', query: (w: any) => w.wave_system !== 'standing-wave' && w.wave_system !== 'river'},
    {id: 'f-4',  title: 'S',   icon: 'shield-3', query: (w: any) => w.wave_system === 'standing-wave'},
    {id: 'f-5',  title: 'R',   icon: 'shield-4', query: (w: any) => w.wave_system === 'river'},
    {id: 'f-6',  title: 'TT',  icon: 'shield-0', query: (w: any) => w.wave_system !== 'river'},
    {id: 'f-7',  title: '[-',  icon: 'shield-5', query: (w: any) => w.status !== 'planned' && w.status !== 'permanently closed' || (w.status === 'open only summer season' && this.isSummer)},
    {id: 'f-8',  title: '[',   icon: 'shield-6', query: (w: any) => w.status === 'planned'},
    {id: 'f-9',  title: '[-]', icon: 'shield-0', query: (w: any) => w.status === 'permanently closed' || (w.status === 'open only summer season' && !this.isSummer)},
    {id: 'f-10', title: '<8',  icon: 'shield-0', query: (w: any) => w.minimum_age < 8}
  ];*/
  nav = [
    {id: 'f-1',  title: 'All', icon: 'shield-0', query: (w: IWaveSpecification) => w},
    {id: 'f-2',  title: '',  icon: 'shield-1-2', query: (w: IWaveSpecification) => w},
    {id: 'f-3',  title: '~',   icon: 'shield-2', query: (w: IWaveSpecification) => this.onGetProductionMethodType(w.waveSpecificationProduct) !== 'Standing' && this.onGetProductionMethodType(w.waveSpecificationProduct) !== 'River'},
    {id: 'f-4',  title: 'S',   icon: 'shield-3', query: (w: IWaveSpecification) => this.onGetProductionMethodType(w.waveSpecificationProduct) === 'Standing'},
    {id: 'f-5',  title: 'R',   icon: 'shield-4', query: (w: IWaveSpecification) => this.onGetProductionMethodType(w.waveSpecificationProduct) === 'River'},
    {id: 'f-6',  title: 'TT',  icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationIndoor},
    {id: 'f-7',  title: '[-',  icon: 'shield-5', query: (w: IWaveSpecification) => w.waveSpecificationStatus !== 'permanently closed' && this.isOpenedLocation(w.waveSpecificationCommissioningDate) || (w.waveSpecificationStatus === 'open only summer season' && this.isSummer)},
    {id: 'f-8',  title: '[',   icon: 'shield-6', query: (w: IWaveSpecification) => w.waveSpecificationStatus === 'planned' || !this.isOpenedLocation(w.waveSpecificationCommissioningDate)},
    {id: 'f-9',  title: '[-]', icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationStatus === 'permanently closed' && this.isOpenedLocation(w.waveSpecificationCommissioningDate)},
    {id: 'f-10', title: 'K',  icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationMinimumSurferAge && w.waveSpecificationMinimumSurferAge <= 8},
    {id: 'f-11', title: '♕',  icon: 'shield-0', query: (w: IWaveSpecification) => w.waveSpecificationAffiliate},
  ];
  waveLocations: IWaveLocation[] = [];
  specifications: IWaveSpecification[] = [];
  filteredLocations: IWaveLocation[] = [];
  activeFilters: any[] = [];
  destroyer$ = new Subject();
  sortedItems: any[] = []; // Sorted array of items
  sortColumn: string = '';
  sortDirection: number = 1;
  lastUpdated?: string;

  products: IWaveSystemProduct[] = [];
  productionMethods: IWaveProductionMethod[] = [];


  constructor(private fireService: FireService) { }

  get isSummer(): boolean {
    const month = new Date().getMonth() + 1;
    return month > 6 && month < 9
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    this.fireService.onGetSecondCollection('specifications');
    this.fireService.collectionSecondData$.pipe(takeUntil(this.destroyer$)).subscribe((resp: IWaveSpecification[]) => {
      this.specifications = resp;

      this.fireService.onGetCollection('locations');
      this.fireService.collectionData$.pipe(takeUntil(this.destroyer$)).subscribe((resp: IWaveLocation[]) => {

        this.lastUpdated = this.getLastUpdated(this.specifications, resp);

        resp.filter(s => s.waveLocationAffiliate).forEach(s => {
          this.specifications.filter(sp => sp.waveSpecificationLocation === s.waveLocationKey).forEach(z => {
            z.waveSpecificationAffiliate = true;
          })
        })
        resp.forEach((l: any) => {
          l.price = this.getPrice(l.waveLocationKey) > 0 ? this.getPrice(l.waveLocationKey) : '-';
          l.ppms = this.getPPMSonBoard(l);
        })

        resp.filter((l: any) => l && l.waveLocationName && !(isNaN(Number(this.getPPMSonBoard(l))) || Number(this.getPPMSonBoard(l)) === 0))
            // @ts-ignore
            .sort((a,b) => (this.getPPMSonBoard(a) > this.getPPMSonBoard(b)) ? 1 : ((this.getPPMSonBoard(b) > this.getPPMSonBoard(a)) ? -1 : 0))
            .reverse()
            .forEach((m: any) => {
              this.waveLocations.push(m);
            })
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        this.onFilter(this.nav[0]);
      });
    })

    this.fireService.onGetThirdCollection('products');
    this.fireService.onGetFourthCollection('production-methods');
    this.fireService.collectionThirdData$.pipe(takeUntil(this.destroyer$)).subscribe(res => {
      this.products = res;
    });
    this.fireService.collectionFourthData$.pipe(takeUntil(this.destroyer$)).subscribe(res => {
      this.productionMethods = res
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onGetProductionMethodType(product: any) {
    const productItem = this.products.find(pr => pr.waveSystemProductKey === product);
    const waveProductionMethodType = this.productionMethods.find(pm => pm.waveProductionMethodKey === productItem?.waveSystemProductProductionMethod)?.waveProductionMethodType;
    return waveProductionMethodType ? waveProductionMethodType : '';
  }

  getLastUpdated(specifications: IWaveSpecification[],  locations: IWaveLocation[]) {
    let lastUpdatedDate = specifications[0].waveSpecificationLastUpdated;
    const specificationDates = specifications.map(item => item.waveSpecificationLastUpdated).filter(item => !!item);
    const locationDates = locations.map(item => item.waveLocationLastUpdated).filter(item => !!item);
    specificationDates.concat(locationDates).forEach((date: any) => {
      // @ts-ignore
      if (new Date(date) > new Date(lastUpdatedDate)) {
        lastUpdatedDate = date;
      }
    });

    return lastUpdatedDate!.split(' ')[0].split('-').reverse().join('.');
  }

  getPPMSonBoard(item: IWaveLocation) {
    const specifications = this.specifications.filter(s => s.waveSpecificationLocation === item.waveLocationKey);
    //console.log(item)
    const price = specifications && specifications[0] && specifications[0]?.waveSpecificationPriceAdultHigh ? specifications[0].waveSpecificationPriceAdultHigh : 0;
    const waves = specifications && specifications[0] && specifications[0]?.waveSpecificationRidesPerHour ? specifications[0].waveSpecificationRidesPerHour : 0;
    const duration = specifications && specifications[0] && specifications[0]?.waveSpecificationDurationRide ? specifications[0].waveSpecificationDurationRide : 0;
    const PPMSonBoard = (Number(price)/(Number(waves)*Number(duration))) * 60;
    /*return (isNaN(PPMSonBoard) || PPMSonBoard === 0) ? '-' : (PPMSonBoard / 60).toFixed(2)*/
    return (isNaN(PPMSonBoard) || PPMSonBoard === 0) ? '-' : Math.round(PPMSonBoard * 100) / 100;
  }

  // PPMSonBoard = price_adult_high / (waves_per_hour x ride_duration)

  onFilter(filter?: any) {
    this.filteredLocations.length = 0;
    let filteredGatherLocationsData = [...this.waveLocations];
    let filteredSpecifications = [...this.specifications];
    let locationKeyArray: string[] = [];
    let mixArrayOfSpec = [];

    if(filter) {
       if (filter.id !== 'f-1') {
        if (this.activeFilters.includes(this.nav[0])) {
          this.activeFilters.shift();
        } else if (filter.id === 'f-7' && this.activeFilters.includes(this.nav[8])) {
          const removeIndex = this.activeFilters.findIndex(f => f.id === this.nav[8].id);
          this.activeFilters.splice(removeIndex, 1);
        } else if (filter.id === 'f-9' && this.activeFilters.includes(this.nav[6])) {
          const removeIndex = this.activeFilters.findIndex(f => f.id === this.nav[6].id);
          this.activeFilters.splice(removeIndex, 1);
        }

        if (!this.activeFilters.includes(filter)) {
          this.activeFilters.push(filter);
        } else {
          const removeIndex = this.activeFilters.findIndex(f => f.id === filter.id);
          this.activeFilters.splice(removeIndex, 1);
          if (!this.activeFilters.length) {
            this.activeFilters = [this.nav[0]];
          }
        }

        /*this.activeFilters.forEach(f => {
          filteredGatherData = filteredGatherData.filter((location: IWaveLocation) => {
            return f.id !== 'f-2'
                ? (filteredGatherData.filter((location: IWaveLocation) => [...new Set((waveSpecifications as any[]).filter(filter.query).map(spec => spec.waveSpecificationLocation))].includes(location.waveLocationKey)))
                : this.checkDistanceBetweenOriginAndLocation(location.waveLocationVisitAddress.lat, location.waveLocationVisitAddress.lng);
          });
        })*/
         /*this.activeFilters.forEach(f => {
           if (f.id !== 'f-2') {
             filteredSpecifications = filteredSpecifications.filter(f.query);
           }
         })
         locationKeyArray = [...new Set(filteredSpecifications.map(spec => spec.waveSpecificationLocation))];
         filteredGatherLocationsData = filteredGatherLocationsData.filter((loc: IWaveLocation) => locationKeyArray.includes(loc.waveLocationKey));*/
         if (this.activeFilters.length === 1) {
           if (this.activeFilters[0].id !== 'f-2') {
             filteredSpecifications = filteredSpecifications.filter(this.activeFilters[0].query);
           }

           locationKeyArray = [...new Set(filteredSpecifications.map(spec => spec.waveSpecificationLocation))];
           filteredGatherLocationsData = filteredGatherLocationsData.filter((loc: IWaveLocation) => locationKeyArray.includes(loc.waveLocationKey));
         } else if (this.activeFilters.length > 1) {
           for (let i = 0; i <= this.activeFilters.length - 1; i++) {
             const tempArr = [...this.specifications].filter(this.activeFilters[i].query);
             const tempArrLocationKeys = [...new Set(tempArr.map(s => s.waveSpecificationLocation))];
             mixArrayOfSpec.push(tempArrLocationKeys);
           }
           // @ts-ignore
           const filteredLocationsKeys = this.findAppropriateElement(mixArrayOfSpec);
           filteredGatherLocationsData = [...this.waveLocations].filter((loc: IWaveLocation) => filteredLocationsKeys.includes(loc.waveLocationKey));
         }

         if (this.activeFilters.find((f: any) => f.id === 'f-2')) {
           filteredGatherLocationsData = filteredGatherLocationsData.filter(location => this.checkDistanceBetweenOriginAndLocation(location.waveLocationVisitAddress.lat, location.waveLocationVisitAddress.lng));
         }
         filteredGatherLocationsData = [...new Set(filteredGatherLocationsData)];
        this.filteredLocations = filteredGatherLocationsData;
      } else if (filter.id === 'f-1') {
        this.activeFilters = [this.nav[0]];
        this.filteredLocations = filteredGatherLocationsData;
      }

    } else {
      this.activeFilter = 'f-1';
      this.filteredLocations = [...this.filteredLocations.filter((location: IWaveLocation) => location.waveLocationVisitAddress && location.waveLocationVisitAddress.name && location.waveLocationVisitAddress.name.toLowerCase().includes(this.selected.toLowerCase()))];
    }
  }

  findAppropriateElement(arrays: [][]) {
    let commonElements: any = [];

    let firstArray = arrays[0];

    for (let i = 0; i < firstArray.length; i++) {
      let currentObject = firstArray[i];
      let isCommon = true;

      for (let j = 1; j < arrays.length; j++) {
        let found = false;
        for (let k = 0; k < arrays[j].length; k++) {
          let innerObject = arrays[j][k];
          if (this.isObjectEqual(currentObject, innerObject)) {
            found = true;
            break;
          }
        }

        if (!found) {
          isCommon = false;
          break;
        }
      }

      if (isCommon) {
        commonElements.push(currentObject);
      }
    }

    return commonElements;
  }

  isObjectEqual(obj1: any, obj2: any) {
    return obj1 === obj2;
  }

  getPrice(id: string) {
    return this.specifications.filter(item => item.waveSpecificationLocation === id)[0]?.waveSpecificationPriceAdultHigh
  }

  isOpenedLocation(date: string): boolean {
    const toFormat = date.slice(0,4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
    return new Date(toFormat) < new Date();
  }

  activeFilterCheck(filterId: string) {
    return this.activeFilters.find((f: any) => f.id === filterId);
  }

  checkDistanceBetweenOriginAndLocation(lat: string, lng: string) {
    let locPos = {lat, lng};

    return this.calculateDistance(this.center, locPos) <= 622;
  }

  calculateDistance(mk1: any, mk2: any) {
    const R = 3958.8;
    const rlat1 = mk1.lat * (Math.PI/180);
    const rlat2 = mk2.lat * (Math.PI/180);
    const difflat = rlat2-rlat1;
    const difflon = (mk2.lng-mk1.lng) * (Math.PI/180);

    return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  }

  sortTable(column: string) {
    if (column === this.sortColumn) {
      // Reverse sort direction if the same column is clicked again
      this.sortDirection = -this.sortDirection;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    // Sort the items based on the current column and direction
    this.sortedItems = this.filteredLocations.sort((a, b) => {
      // @ts-ignore
      const aValue = a[this.sortColumn];
      // @ts-ignore
      const bValue = b[this.sortColumn];

      if (aValue < bValue) {
        return -1 * this.sortDirection;
      } else if (aValue > bValue) {
        return 1 * this.sortDirection;
      } else {
        return 0;
      }
    });
  }

}

